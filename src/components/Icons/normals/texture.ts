// Source: https://github.com/jsoverson/texture.js
// Jarrod Overson, jsoverson

interface ITextureOptions {
  shininess?: number;
  brightness?: number;
  ambient?: number;

  normal: string;
}

interface ILightPosition {
  x: number;
  y: number;
  z: number;
}

class Texture {
  renderElement: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;

  texture: HTMLImageElement;
  textureData = new Uint8ClampedArray();
  normal: HTMLImageElement;

  imageData?: ImageData;

  loaded?: Promise<Texture>;
  ready: boolean;

  shininess: number;
  brightness: number;
  ambient: number;

  normals: number[];

  lightPosition?: ILightPosition;

  constructor(texture, options: ITextureOptions) {
    this.shininess = options.shininess || 0;
    this.brightness = options.brightness === undefined ? 1 : options.brightness;
    this.ambient = options.ambient === undefined ? 0.5 : options.ambient;

    this.texture = document.createElement("img");
    this.normal = document.createElement("img");

    this.loaded = new Promise((resolve, reject) => {
      this.texture.onload = this.normal.onload = () => {
        this.ready = this.texture.complete && this.normal.complete;
        if (this.ready) resolve(this);
      };
      this.texture.src = texture;
      this.normal.src = options.normal;
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.loaded.then(this.onload.bind(this));

    this.ready = false;
    this.renderElement = document.createElement("canvas");
    this.renderContext = this.renderElement.getContext("2d", {
      willReadFrequently: true,
      desynchronized: true,
    })!;
    this.normals = [];
  }

  onload() {
    let width = (this.renderElement.width = this.texture.width);
    let height = (this.renderElement.height = this.texture.height);

    this.renderContext.drawImage(this.texture, 0, 0);
    this.textureData = this.renderContext.getImageData(0, 0, width, height).data;

    this.renderContext.drawImage(this.normal, 0, 0);
    let mapData = this.renderContext.getImageData(0, 0, width, height).data;

    let imageDataLength = height * width * 4;
    let max = 255;

    // precalculate the normal vectors
    for (let i = 0; i < imageDataLength; i += 4) {
      // normalizes vector values across a -1, 1 scale
      let nx = (mapData[i] * 2 - max) / max;
      let ny = ((max - mapData[i + 1]) * 2 - max) / max;
      let nz = (mapData[i + 2] * 2 - max) / max;

      this.normals.push(nx, ny, nz);
    }

    if (this.lightPosition) this.moveLight(this.lightPosition);
  }

  toDataURL() {
    return this.renderElement.toDataURL();
  }

  moveLight(pos: ILightPosition) {
    this.lightPosition = pos;
    if (!this.ready) return;

    let lx = pos.x;
    let ly = pos.y;
    let lz = pos.z;

    let normals = this.normals;
    let textureData = this.textureData;
    let shine = this.shininess;
    let brightness = this.brightness;
    let ambient = this.ambient;

    let width = this.renderElement.width;
    let height = this.renderElement.height;

    // get renderElement's imageData because we're going to be setting channels directly.
    // cache and reuse it to limit expensive getImageData calls
    this.imageData = this.imageData || this.renderContext.getImageData(0, 0, width, height);
    let pixelData = this.imageData.data;

    let ipx = 0;
    let inorm = 0;
    let x, y;
    let dx, dy, dz, inverseMagnitude, dot, intensity, channel, channelValue;

    // adjust intensity for every pixel
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        // calculate the light direction vector
        dx = lx - x;
        dy = ly - y;
        dz = lz; // texture is at 0

        // unit vector of direction (inverted to save on div calcs.)
        inverseMagnitude = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
        dx *= inverseMagnitude;
        dy *= inverseMagnitude;
        dz *= inverseMagnitude;

        // dot product of the direction and the normal
        dot = dx * normals[inorm++] + dy * normals[inorm++] + dz * normals[inorm++];
        intensity = dot * brightness;
        intensity += Math.pow(dot, 10) * shine;
        intensity += ambient;

        // inlined and unrolled for perf
        channelValue = textureData[ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        channelValue = textureData[++ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        channelValue = textureData[++ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        ipx += 2; // index of next pixel (skip alpha channel)

        // used to check bounds above, but looks like browser does it so it was a useless, expensive check
        // (in other words, don't check bounds thinking this was a mistake)
        // pixelData[ipx] = ~~(channelValue > 255 ? 255 : channelValue < 0 ? 0 : channelValue);
      }
    }

    this.renderContext.putImageData(this.imageData, 0, 0);
    return this;
  }
}

export default Texture;
