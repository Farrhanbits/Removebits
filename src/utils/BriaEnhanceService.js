/**
 * Bria AI Image Enhancement Service
 * API Token: 7718498059aa4ae48af6c1219a077cec
 * Endpoint: POST https://engine.prod.bria-api.com/v2/image/edit/enhance
 * Note: Async-only (sync not supported). Uses polling via status_url.
 */

const BRIA_ENHANCE_TOKEN = '7718498059aa4ae48af6c1219a077cec';
const BRIA_ENHANCE_ENDPOINT = 'https://engine.prod.bria-api.com/v2/image/edit/enhance';

const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 40; // up to 60 seconds

/**
 * Poll status URL until job completes
 * @param {string} statusUrl
 * @returns {Promise<string>} Final image_url
 */
async function pollUntilComplete(statusUrl, onProgress) {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const res = await fetch(statusUrl, {
      headers: { 'api_token': BRIA_ENHANCE_TOKEN },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Bria Enhancement status poll error (${res.status}): ${err}`);
    }

    const data = await res.json();

    // Update progress: ramp from 40 → 90 during polling
    const pollProgress = Math.min(90, 40 + (i / POLL_MAX_ATTEMPTS) * 50);
    onProgress(Math.round(pollProgress));

    if (data.status === 'COMPLETED' && data.result?.image_url) {
      return data.result.image_url;
    }

    if (data.status === 'FAILED' || data.status === 'ERROR') {
      throw new Error(`Bria Enhancement job failed: ${data.error?.message || 'Unknown error'}`);
    }
  }
  throw new Error('Bria Enhancement timed out after maximum polling attempts');
}

/**
 * Enhance image quality using Bria AI v2
 * @param {string} imageBase64 - Base64 data URL of the image
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<HTMLImageElement>} Enhanced result image
 */
export async function enhanceBriaImage(imageBase64, onProgress = () => {}) {
  onProgress(15);

  // Submit job (async mode only - sync not supported by this endpoint)
  const response = await fetch(BRIA_ENHANCE_ENDPOINT, {
    method: 'POST',
    headers: {
      'api_token': BRIA_ENHANCE_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageBase64,
      sync: false,
    }),
  });

  onProgress(30);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Bria Enhancement Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const statusUrl = data.status_url;
  if (!statusUrl) throw new Error('No status_url returned from Bria Enhancement API');

  onProgress(40);

  // Poll until complete
  const resultUrl = await pollUntilComplete(statusUrl, onProgress);

  onProgress(92);

  // Load final enhanced image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { onProgress(100); resolve(img); };
    img.onerror = () => reject(new Error('Failed to load enhanced result image'));
    img.src = resultUrl;
  });
}
