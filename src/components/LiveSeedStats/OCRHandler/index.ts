import Tesseract from "tesseract.js";
// import Tesseract from "../../../../node_modules/tesseract.js/src/index.js";

import genCanvases, { IFontCanvases } from "./getFontCanvases";
import {
  copyImage,
  crop,
  enhance,
  stretch,
  diff,
  invert,
  printImage,
} from "../../../services/imageActions/webCanvasImageActions";

const startCapture = async (displayMediaOptions: MediaStreamConstraints): Promise<MediaStream | null> => {
  let captureStream: MediaStream;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } catch (err) {
    console.error("Error: " + err);
    return null;
  }
  return captureStream;
};

interface OCRConfig {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  onUpdate?: () => void;
}
class OCRHandler extends EventTarget {
  ready = false;
  loop = false;

  mediaStream?: MediaStream;
  lastBitmap?: ImageBitmap;
  tesseractWorker!: Tesseract.Worker;

  fontData!: IFontCanvases;

  canvasRef?: OCRConfig["canvasRef"];
  onUpdate: () => void;

  lastCapture = new Date();

  constructor(config: OCRConfig) {
    super();
    if (config.canvasRef) {
      this.canvasRef = config.canvasRef;
    }
    if (config.onUpdate) {
      this.onUpdate = config.onUpdate;
    } else {
      this.onUpdate = () => {};
    }
    const init = async () => {
      await Promise.all([this.startTesseract(), this.genCanvases()]);

      this.ready = true;
      this.onUpdate();
    };
    init().catch(e => console.error(e));
  }

  async genCanvases() {
    this.fontData = await genCanvases();
  }

  async startTesseract() {
    const worker = await Tesseract.createWorker("eng", undefined, {
      errorHandler: e => {
        console.error(e);
        this.startTesseract().catch(e => console.error(e));
      },
      // logger: console.log,
      // logger: this.canvasRef ? console.log : () => { },
    });

    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
    }

    this.tesseractWorker = worker;
  }

  async startCapture(displayMediaOptions: MediaStreamConstraints = {}) {
    const ms = await startCapture(displayMediaOptions);
    if (ms) {
      this.mediaStream = ms;
      this.loop = true;
      this.captureLoop().catch(e => console.log(e));
      this.onUpdate();
    }
  }

  async restart() {
    await this.stopCapture();
    await this.startCapture();
  }

  async stopCapture() {
    this.loop = false;
    this.mediaStream?.getTracks().forEach(track => {
      track.stop();
    });
    delete this.mediaStream;
    this.onUpdate();
  }

  async doSingleDetect(blob: Blob) {
    this.lastBitmap = await createImageBitmap(blob);
    await this.doLoop();
  }

  async doLoop() {
    try {
      const seed = await this.getSeedFromImage();
      if (!seed) {
        this.lastCapture = new Date();
        return;
      }
      if (parseInt(seed, 10) > 4294967295) {
        this.lastCapture = new Date();
        return;
      }
      if (seed) {
        this.dispatchEvent(new CustomEvent("seed", { detail: { seed } }));
      }
    } catch (e) {
      console.error("captureLoop error:", e);
      await this.stopCapture();
      // return this.startCapture();
    }
    this.lastCapture = new Date();
  }

  async captureLoop() {
    while (this.loop) {
      if (+new Date() - +this.lastCapture < 1000) {
        await new Promise(r => setTimeout(r, 250));
      }
      if (this.canvasRef) {
        // to debug
        console.log("One-time capture");
        await new Promise(res => setTimeout(res, 5000)).then(() => {
          this.loop = false;
        });
      }
      await this.getBitmap();
      if (!this.lastBitmap) {
        throw new Error("Cannot get bitmap");
      }
      await this.doLoop();
    }
  }

  async getBitmap() {
    const track = this.mediaStream?.getVideoTracks()[0];
    if (!track) {
      return;
    }
    const imageCapture = new ImageCapture(track);
    this.lastBitmap = await imageCapture.grabFrame();
    this.onUpdate();
    return this.lastBitmap;
  }

  getDisplayParams() {
    return {
      width: this.lastBitmap!.width,
      height: this.lastBitmap!.height,
    };
  }

  async getSeedFromImage() {
    const bm = this.lastBitmap;
    if (!bm) {
      console.error("Could not get current screencap");
      return;
    }

    const displayParams = this.getDisplayParams();
    const img = invert(
      enhance(
        crop(
          copyImage(bm),
          20,
          displayParams.height - displayParams.height / 8,
          displayParams.width / 2.3,
          displayParams.height / 8,
        ),
      ),
    );

    if (this.canvasRef) {
      this.canvasRef.current!.width = img.width;
      this.canvasRef.current!.height = img.height;
      const ctx = this.canvasRef.current!.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
    }

    const res = await this.tesseractWorker.recognize(
      img as any,
      {},
      {
        text: true,
        blocks: true,
        debug: true,
      },
    );
    if (!res.data || !res.data.blocks) {
      return;
    }
    const lines = res.data.blocks.map(block => block.paragraphs.map(paragraph => paragraph.lines)).flat(2);
    const secondLine = lines[1]; // seed is on the second line always
    if (!secondLine) {
      return;
    }
    if (!secondLine.words[0].text.includes("eed")) {
      return;
    }
    let i = 0; // to debug
    const text = secondLine.words[1].symbols
      .reduce<string>((t, s) => {
        const letter = crop(img, s.bbox.x0, s.bbox.y0, s.bbox.x1 - s.bbox.x0, s.bbox.y1 - s.bbox.y0);
        const char = this.getBestFitChar(letter, i);
        t += char;
        i++;
        return t;
      }, "")
      .replace(/\s/g, "");
    this.onUpdate();
    return text;
  }

  getBestFitChar = (char: any, debugOffset = 0): string => {
    let maxFit = Number.MAX_SAFE_INTEGER;
    let bestChar = "";
    let i = 0;
    for (const [fontChar, fontCharCanvas] of Object.entries(this.fontData)) {
      const stretched = stretch(fontCharCanvas, char.width, char.height);
      const d = diff(char, stretched);

      if (maxFit > d) {
        if (this.canvasRef) {
          // to debug
          const ctx = this.canvasRef.current!.getContext("2d")!;
          ctx.drawImage(char, 1 + 20 * i, 20 * debugOffset);
          ctx.drawImage(stretched, 1 + 20 * i, 40 * debugOffset);
          // ctx.drawImage(fontCharCanvas, 1 + 20 * i, 60 * debugOffset);
        }
        maxFit = d;
        bestChar = fontChar;
      }
      i++;
    }
    return bestChar;
  };
}

export const useOCRHandler = (config: OCRConfig) => {
  const ocrHandler = new OCRHandler(config);

  return ocrHandler;
};

export default OCRHandler;
