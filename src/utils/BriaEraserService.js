/**
 * BRIA Image Eraser v2 API Integration Service
 * Connects brush selection to BRIA AI's /v2/image/edit/erase endpoint
 */

const BRIA_API_TOKEN = 'c25c81cf096347119aa8425790d2b7da';
const BRIA_ENDPOINT = 'https://engine.prod.bria-api.com/v2/image/edit/erase';

export class BriaEraserService {
  /**
   * Generates a black & white mask image URL from the user's brush mask canvas.
   * BRIA format requirement: White (255,255,255) = erase, Black (0,0,0) = keep.
   * @param {HTMLCanvasElement} maskCanvas
   * @returns {string} Base64 PNG data URL
   */
  static generateBriaMask(maskCanvas) {
    const width = maskCanvas.width;
    const height = maskCanvas.height;

    // Create temporary offscreen canvas for B&W mask
    const bwCanvas = document.createElement('canvas');
    bwCanvas.width = width;
    bwCanvas.height = height;
    const bwCtx = bwCanvas.getContext('2d');

    // Fill entirely with solid black (keep area)
    bwCtx.fillStyle = '#000000';
    bwCtx.fillRect(0, 0, width, height);

    // Read mask canvas pixels
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    const maskData = maskCtx.getImageData(0, 0, width, height);
    const pixels = maskData.data;

    // Create binary white mask on top of black
    const bwData = bwCtx.getImageData(0, 0, width, height);
    const bwPixels = bwData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      // If mask has opacity or color drawn by the user
      if (pixels[i + 3] > 20 || pixels[i] > 40 || pixels[i + 1] > 40 || pixels[i + 2] > 40) {
        bwPixels[i] = 255;     // Red
        bwPixels[i + 1] = 255; // Green
        bwPixels[i + 2] = 255; // Blue
        bwPixels[i + 3] = 255; // Alpha
      } else {
        bwPixels[i] = 0;
        bwPixels[i + 1] = 0;
        bwPixels[i + 2] = 0;
        bwPixels[i + 3] = 255;
      }
    }

    bwCtx.putImageData(bwData, 0, 0);
    return bwCanvas.toDataURL('image/png');
  }

  /**
   * Erase masked object using BRIA Image Eraser v2 API
   * @param {HTMLCanvasElement} imageCanvas - Original image canvas
   * @param {HTMLCanvasElement} maskCanvas - User mask canvas
   * @param {Function} onProgress - Progress reporter callback
   * @returns {Promise<HTMLImageElement>} Reconstructed result image
   */
  static async eraseObject(imageCanvas, maskCanvas, onProgress = () => {}) {
    onProgress(15);

    // 1. Prepare Base64 Image and B&W Mask
    const imageBase64 = imageCanvas.toDataURL('image/png');
    const maskBase64 = this.generateBriaMask(maskCanvas);

    onProgress(30);

    // 2. Call BRIA v2 Erase endpoint
    const response = await fetch(BRIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'api_token': BRIA_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        mask: maskBase64,
        sync: true,
        preserve_alpha: true,
      }),
    });

    onProgress(65);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`BRIA API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    onProgress(85);

    // BRIA returns { result: { image_url: "..." }, request_id: "..." }
    const resultUrl = data.result?.image_url;
    if (!resultUrl) {
      throw new Error('No result image_url returned from BRIA API');
    }

    // 3. Load the resulting image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        onProgress(100);
        resolve(img);
      };
      img.onerror = (e) => reject(new Error('Failed to load result image from BRIA'));
      img.src = resultUrl;
    });
  }
}
