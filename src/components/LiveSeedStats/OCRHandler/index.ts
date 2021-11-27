import Tesseract from 'tesseract.js';

import genCanvases, { IFontCanvases } from './getFontCanvases';
import { copyImage, crop, enhance, stretch,  clearBg, diff } from './imageActions';

const startCapture = async (
  displayMediaOptions: DisplayMediaStreamConstraints
): Promise<MediaStream | null> => {
  let captureStream: MediaStream;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error('Error: ' + err);
    return null;
  }
  return captureStream;
};

interface OCRConfig {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onUpdate?: () => void;
}
class OCRHandler extends EventTarget {
  ready = false;
  loop = false;

  mediaStream?: MediaStream;
  lastBitmap?: ImageBitmap;
  tesseractWorker!: Tesseract.Worker;

  fontData!: IFontCanvases;

  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onUpdate: () => void;

  constructor(config: OCRConfig) {
    super();
    if (config.canvasRef) {
      this.canvasRef = config.canvasRef;
    }
    if (
      config.onUpdate
    ) {
      this.onUpdate = config.onUpdate;
    } else {
      this.onUpdate = () => { };
    }
    const init = async () => {
      await this.startTesseract();
      await this.genCanvases();

      this.ready = true;
      this.onUpdate();
    };
    init();
  }

  async genCanvases() {
    this.fontData = await genCanvases();
  }

  async startTesseract() {
    const worker = Tesseract.createWorker({
      errorHandler: (e) => {
        console.error(e);
        this.startTesseract();
      }
      // logger: (m: any) => console.log(m),
    });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessjs_create_hocr: '0',
      tessjs_create_tsv: '0',
      tessjs_create_box: '0',
    });

    this.tesseractWorker = worker;
  }

  async startCapture(displayMediaOptions: DisplayMediaStreamConstraints = {}) {
    const ms = await startCapture(displayMediaOptions);
    if (ms) {
      this.mediaStream = ms;
      this.loop = true;
      this.captureLoop();
      this.onUpdate();
    }
  }

  async stopCapture() {
    this.mediaStream?.getTracks().forEach(track => {
      track.stop();
    });
    this.loop = false;
    delete this.mediaStream;
    this.onUpdate();
  }

  async captureLoop() {
    while (this.loop) {
      await this.getBitmap();
      if (!this.lastBitmap) {
        throw new Error('Cannot get bitmap');
      }
      const seed = await this.getSeedFromImage();
      if (!seed) {
        continue;
      }
      if (parseInt(seed, 10) > 4294967295) {
        continue;
      }
      if (seed) {
        this.dispatchEvent(new CustomEvent('seed', { detail: { seed } }));
      }
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
    return ({
      width: this.lastBitmap!.width,
      height: this.lastBitmap!.height
    });
  }

  async getSeedFromImage() {
    const bm = this.lastBitmap;
    if (!bm) {
      console.error("Could not get current screencap");
      return;
    }

    const displayParams = this.getDisplayParams();
    const t = enhance(crop(
      copyImage(bm),
      0,
      displayParams.height - displayParams.height / 8,
      displayParams.width / 2.3,
      displayParams.height / 8
    ));

    const res = await this.tesseractWorker.recognize(t);
    const secondLine = res.data.lines[1]; // seed is on the second line always
    if (!secondLine) {
      return;
    }
    const seed = secondLine.words[1];
    if (!seed) {
      return;
    }
    let text = '';
    seed.symbols.forEach((s, i) => {
      const letter = clearBg(crop(t, s.bbox.x0, s.bbox.y0, s.bbox.x1 - s.bbox.x0, s.bbox.y1 - s.bbox.y0));
      const char = this.getBestFitChar(letter);
      text += char;
    });
    this.onUpdate();
    return text;
  }

  getBestFitChar = (char: HTMLCanvasElement): string => {
    let maxFit = Number.MIN_SAFE_INTEGER;
    let bestChar = '';
    // let i = 0;
    for (const [fontChar, fontCharCanvas] of Object.entries(this.fontData)) {
      const stretched = stretch(fontCharCanvas, char.width, char.height);
      // const stretched = stretch(fontCharCanvas, char.width, char.height);
      // const ctx = this.canvasRef.current!.getContext('2d')!;

      // createImage(fontCharCanvas.width, fontCharCanvas.height);
      const d = diff(char, stretched);
      // ctx.drawImage(char, 1, 20);
      // ctx.drawImage(stretched, 1 + 20 * i, 40);
      // ctx.drawImage(fontCharCanvas, 1, 60);

      if (maxFit < -d) {
        maxFit = -d;
        bestChar = fontChar;
      }
      // i++;
    }
    return bestChar;
  }
}

export const useOCRHandler = (config: OCRConfig) => {
  const ocrHandler = new OCRHandler(config);

  return ocrHandler;
}

export default OCRHandler;
