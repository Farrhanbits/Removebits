/**
 * High-definition sample image presets for instant one-click testing of object removal.
 * Generates crisp 1200x800 photographic canvases with unwanted objects and clean background reconstructions.
 */

function generateBeachPreset() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Sky Gradient (Sunset)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 480);
  skyGrad.addColorStop(0, '#31103f');
  skyGrad.addColorStop(0.3, '#78235e');
  skyGrad.addColorStop(0.65, '#e26d5c');
  skyGrad.addColorStop(0.9, '#ffba49');
  skyGrad.addColorStop(1, '#ffe066');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1200, 480);

  // Glowing Sun
  const sunGrad = ctx.createRadialGradient(600, 440, 10, 600, 440, 140);
  sunGrad.addColorStop(0, 'rgba(255, 255, 240, 1)');
  sunGrad.addColorStop(0.3, 'rgba(255, 220, 100, 0.8)');
  sunGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(600, 440, 140, 0, Math.PI * 2);
  ctx.fill();

  // Distant Horizon & Sea
  const seaGrad = ctx.createLinearGradient(0, 470, 0, 560);
  seaGrad.addColorStop(0, '#d86a42');
  seaGrad.addColorStop(0.2, '#9a3b5a');
  seaGrad.addColorStop(0.7, '#2c4365');
  seaGrad.addColorStop(1, '#1b6378');
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, 470, 1200, 90);

  // Gentle wave foam lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  for (let y = 520; y <= 555; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(300, y + 4, 800, y - 4, 1200, y);
    ctx.stroke();
  }

  // Golden Wet Sand & Shore
  const sandGrad = ctx.createLinearGradient(0, 560, 0, 800);
  sandGrad.addColorStop(0, '#c7924e');
  sandGrad.addColorStop(0.4, '#dfaa69');
  sandGrad.addColorStop(1, '#c08846');
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, 560, 1200, 240);

  // Shoreline curve
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(600, 565, 620, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Natural wet sand reflection
  const reflGrad = ctx.createRadialGradient(600, 590, 20, 600, 590, 260);
  reflGrad.addColorStop(0, 'rgba(255, 200, 110, 0.35)');
  reflGrad.addColorStop(1, 'rgba(255, 200, 110, 0)');
  ctx.fillStyle = reflGrad;
  ctx.fillRect(0, 560, 1200, 120);

  // Clean background snapshot
  const cleanData = canvas.toDataURL('image/jpeg', 0.98);

  // Now paint the UNWANTED OBJECT: Bright Red & Yellow Beach Umbrella + Cooler Box on the sand
  // Umbrella Pole
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(860, 690);
  ctx.lineTo(845, 530);
  ctx.stroke();

  // Umbrella Canopy
  ctx.save();
  ctx.translate(845, 530);
  ctx.rotate(-0.08);
  ctx.beginPath();
  ctx.arc(0, 0, 85, Math.PI, 0);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  // Yellow stripes
  ctx.beginPath();
  ctx.moveTo(-40, 0);
  ctx.quadraticCurveTo(0, -60, 0, -85);
  ctx.quadraticCurveTo(0, -60, 40, 0);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.restore();

  // Cooler box
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(875, 650, 60, 42);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(873, 644, 64, 8);

  // Shadow on sand
  ctx.fillStyle = 'rgba(70, 40, 10, 0.35)';
  ctx.beginPath();
  ctx.ellipse(870, 694, 75, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  const originalData = canvas.toDataURL('image/jpeg', 0.98);

  return {
    id: 'beach-sunset',
    title: 'Sunset Beach Umbrella',
    category: 'Travel & Vacation',
    description: 'Remove beach umbrella, cooler, and shadows from pristine golden coastline.',
    resolution: '1200 × 800',
    original: originalData,
    clean: cleanData,
    suggestedMask: {
      x: 840,
      y: 590,
      radius: 65,
    },
  };
}

function generateUrbanPreset() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Deep Blue/Grey Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
  skyGrad.addColorStop(0, '#0f172a');
  skyGrad.addColorStop(1, '#334155');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1200, 400);

  // Modern Architectural Glass Building
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(150, 80, 900, 520);

  // Glass Window Grid with Sunset Reflections
  for (let r = 100; r < 580; r += 45) {
    for (let c = 180; c < 1020; c += 70) {
      const winGrad = ctx.createLinearGradient(c, r, c + 60, r + 38);
      winGrad.addColorStop(0, '#0284c7');
      winGrad.addColorStop(0.5, '#38bdf8');
      winGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = winGrad;
      ctx.fillRect(c, r, 60, 36);
    }
  }

  // Polished Granite Plaza Floor
  const floorGrad = ctx.createLinearGradient(0, 600, 0, 800);
  floorGrad.addColorStop(0, '#475569');
  floorGrad.addColorStop(0.5, '#334155');
  floorGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 600, 1200, 200);

  // Floor tiles lines
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 1200; x += 150) {
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x * 1.3 - 180, 800);
    ctx.stroke();
  }

  const cleanData = canvas.toDataURL('image/jpeg', 0.98);

  // Paint UNWANTED OBJECT: Fluorescent Orange Construction Cone with White Reflective Stripes
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.beginPath();
  ctx.ellipse(450, 715, 45, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cone base
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(415, 700, 70, 12);

  // Cone body
  ctx.beginPath();
  ctx.moveTo(422, 702);
  ctx.lineTo(444, 570);
  ctx.lineTo(456, 570);
  ctx.lineTo(478, 702);
  ctx.closePath();
  ctx.fillStyle = '#f97316';
  ctx.fill();

  // Reflective white bands
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(432, 650);
  ctx.lineTo(438, 620);
  ctx.lineTo(462, 620);
  ctx.lineTo(468, 650);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const originalData = canvas.toDataURL('image/jpeg', 0.98);

  return {
    id: 'urban-cone',
    title: 'Plaza Construction Barrier',
    category: 'Architecture & Street',
    description: 'Erase bright orange traffic cone and ground shadows from executive architecture.',
    resolution: '1200 × 800',
    original: originalData,
    clean: cleanData,
    suggestedMask: {
      x: 450,
      y: 650,
      radius: 55,
    },
  };
}

function generateWatchPreset() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Dark Textured Slate Background
  const bgGrad = ctx.createRadialGradient(600, 400, 100, 600, 400, 700);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // Subtle slate texture lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1200, Math.random() * 800);
    ctx.lineTo(Math.random() * 1200, Math.random() * 800);
    ctx.stroke();
  }

  // Luxury Chronograph Watch Bezel
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;

  // Steel casing
  const caseGrad = ctx.createLinearGradient(400, 200, 800, 600);
  caseGrad.addColorStop(0, '#d6d3d1');
  caseGrad.addColorStop(0.3, '#78716c');
  caseGrad.addColorStop(0.7, '#f5f5f4');
  caseGrad.addColorStop(1, '#44403c');
  ctx.fillStyle = caseGrad;
  ctx.beginPath();
  ctx.arc(600, 400, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Watch Dial Face (Emerald / Midnight Blue)
  const dialGrad = ctx.createRadialGradient(600, 400, 10, 600, 400, 160);
  dialGrad.addColorStop(0, '#064e3b');
  dialGrad.addColorStop(0.8, '#022c22');
  dialGrad.addColorStop(1, '#052e16');
  ctx.fillStyle = dialGrad;
  ctx.beginPath();
  ctx.arc(600, 400, 160, 0, Math.PI * 2);
  ctx.fill();

  // Gold hour markers
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = 600 + Math.sin(angle) * 130;
    const y1 = 400 - Math.cos(angle) * 130;
    ctx.beginPath();
    ctx.arc(x1, y1, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Watch hands
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  // Hour hand
  ctx.beginPath();
  ctx.moveTo(600, 400);
  ctx.lineTo(600 + Math.sin(0.8) * 80, 400 - Math.cos(0.8) * 80);
  ctx.stroke();
  // Minute hand
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(600, 400);
  ctx.lineTo(600 + Math.sin(2.4) * 110, 400 - Math.cos(2.4) * 110);
  ctx.stroke();

  const cleanData = canvas.toDataURL('image/jpeg', 0.98);

  // Paint UNWANTED OBJECT: Distracting Red "SAMPLE WATERMARK" Stamp across the luxury watch
  ctx.save();
  ctx.translate(600, 400);
  ctx.rotate(-0.35);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.textAlign = 'center';
  ctx.fillText('• PROOF ONLY - WATERMARK •', 0, 0);

  ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.lineWidth = 3;
  ctx.strokeRect(-280, -32, 560, 46);
  ctx.restore();

  const originalData = canvas.toDataURL('image/jpeg', 0.98);

  return {
    id: 'luxury-watermark',
    title: 'Product Watermark & Stamp',
    category: 'E-Commerce & Commercial',
    description: 'Completely eliminate unwanted copyright stamps and text overlays without blurring.',
    resolution: '1200 × 800',
    original: originalData,
    clean: cleanData,
    suggestedMask: {
      x: 600,
      y: 400,
      radius: 80,
    },
  };
}

let cachedPresets = null;

export function getSamplePresets() {
  if (typeof window === 'undefined') return [];
  if (!cachedPresets) {
    try {
      cachedPresets = [
        generateBeachPreset(),
        generateUrbanPreset(),
        generateWatchPreset(),
      ];
    } catch (e) {
      console.error('Failed to generate presets:', e);
      return [];
    }
  }
  return cachedPresets;
}
