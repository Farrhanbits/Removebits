/**
 * Bria AI Background Removal Service
 * API Token: 6a5b626dbb344ecf8b7103ab7323e659
 * Endpoint: POST https://engine.prod.bria-api.com/v2/image/edit/remove_background
 */

const BRIA_BG_REMOVAL_TOKEN = '6a5b626dbb344ecf8b7103ab7323e659';
const BRIA_BG_REMOVAL_ENDPOINT = 'https://engine.prod.bria-api.com/v2/image/edit/remove_background';

/**
 * Remove background from image using Bria AI v2
 * @param {string} imageBase64 - Base64 data URL of the image
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<HTMLImageElement>} Transparent-background result image
 */
export async function removeBriaBackground(imageBase64, onProgress = () => {}) {
  onProgress(15);

  const response = await fetch(BRIA_BG_REMOVAL_ENDPOINT, {
    method: 'POST',
    headers: {
      'api_token': BRIA_BG_REMOVAL_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageBase64,
      sync: true,
    }),
  });

  onProgress(65);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Bria BG Removal Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const resultUrl = data.result?.image_url;
  if (!resultUrl) throw new Error('No result image_url from Bria Background Removal API');

  onProgress(85);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { onProgress(100); resolve(img); };
    img.onerror = () => reject(new Error('Failed to load result image'));
    img.src = resultUrl;
  });
}
