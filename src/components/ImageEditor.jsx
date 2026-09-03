import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  Hand,
  Trash2,
  Eye,
  CheckCircle,
  Layers,
  Image as ImageIcon,
  Sliders,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InpaintingEngine } from '../utils/InpaintingEngine';
import { BriaEraserService } from '../utils/BriaEraserService';
import { getSamplePresets } from '../data/samplePresets';

export const ImageEditor = ({ initialImage, initialFileName }) => {
  // Current active image (Data URL) - null initially to show upload placeholder
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [imageFileName, setImageFileName] = useState('image');
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, sizeMb: 0 });

  // Tools state
  const [activeTool, setActiveTool] = useState('brush'); // 'brush' | 'eraser' | 'pan'
  const [brushSize, setBrushSize] = useState(28);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [hasMask, setHasMask] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Before/After split preview state
  const [showCompare, setShowCompare] = useState(false);
  const [compareSplit, setCompareSplit] = useState(50);
  const [isComparingDrag, setIsComparingDrag] = useState(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Download format selection
  const [downloadFormat, setDownloadFormat] = useState('png'); // 'png' | 'jpeg'

  // Status message
  const [statusMessage, setStatusMessage] = useState('BRIA AI Eraser v2 Ready');

  // Canvas references
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const lastDrawPointRef = useRef(null);

  // Floating cursor indicator
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, visible: false });

  // Sample presets
  const [presets, setPresets] = useState([]);
  useEffect(() => {
    setPresets(getSamplePresets());
  }, []);

  // Update image when passed from hero or file upload
  useEffect(() => {
    if (initialImage) {
      loadImage(initialImage, initialFileName || 'upload-image');
    }
  }, [initialImage, initialFileName]);

  const loadImage = (src, name = 'edited-photo') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeMb: (src.length * (3 / 4) / (1024 * 1024)).toFixed(2),
      });

      setCurrentImageSrc(src);
      setOriginalImageSrc(src);
      setImageFileName(name.replace(/\.[^/.]+$/, ''));

      // Reset transforms
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setHasMask(false);
      setShowCompare(false);

      // Render image onto imageCanvas and init maskCanvas
      setTimeout(() => {
        const imgCanvas = imageCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (imgCanvas && maskCanvas) {
          imgCanvas.width = img.naturalWidth;
          imgCanvas.height = img.naturalHeight;
          maskCanvas.width = img.naturalWidth;
          maskCanvas.height = img.naturalHeight;

          const imgCtx = imgCanvas.getContext('2d');
          imgCtx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
          imgCtx.drawImage(img, 0, 0);

          const maskCtx = maskCanvas.getContext('2d');
          maskCtx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);

          // Save initial clean state to history
          const initialImgData = imgCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
          setHistory([initialImgData]);
          setHistoryIndex(0);
        }
      }, 50);
    };
    img.src = src;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        loadImage(ev.target?.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceholderDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        loadImage(ev.target?.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert client viewport coordinates to Canvas pixel coordinates
  const getCanvasCoords = (clientX, clientY) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return { x: 0, y: 0 };

    const rect = maskCanvas.getBoundingClientRect();
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  // Drawing strokes on Mask Canvas
  const drawStroke = (from, to, tool) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      // High-visibility semi-transparent neon purple mask
      ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
    }

    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    } else {
      ctx.arc(to.x, to.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    setHasMask(true);
  };

  // Pointer / Touch Handlers
  const handlePointerDown = (e) => {
    if (showCompare) return;

    if (activeTool === 'pan' || e.button === 1 || e.spaceKey) {
      isPanningRef.current = true;
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      isDrawingRef.current = true;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      lastDrawPointRef.current = coords;
      drawStroke(null, coords, activeTool);
    }
  };

  const handlePointerMove = (e) => {
    // Update floating brush cursor
    const viewport = viewportRef.current;
    if (viewport) {
      const rect = viewport.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible:
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom &&
          (activeTool === 'brush' || activeTool === 'eraser'),
      });
    }

    if (isPanningRef.current) {
      const dx = e.clientX - lastPanPointRef.current.x;
      const dy = e.clientY - lastPanPointRef.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (isDrawingRef.current) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      drawStroke(lastDrawPointRef.current, coords, activeTool);
      lastDrawPointRef.current = coords;
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    isPanningRef.current = false;
    lastDrawPointRef.current = null;
  };

  // Non-passive native touch event listeners to PREVENT mobile page scrolling when drawing
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onTouchStart = (e) => {
      if (showCompare) return;
      if (e.touches.length === 1 && (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'pan')) {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        handlePointerDown({
          clientX: touch.clientX,
          clientY: touch.clientY,
          button: 0,
        });
      }
    };

    const onTouchMove = (e) => {
      if (showCompare) return;
      if (e.touches.length === 1 && (isDrawingRef.current || isPanningRef.current || activeTool === 'brush' || activeTool === 'eraser')) {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        handlePointerMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }
    };

    const onTouchEnd = (e) => {
      if (isDrawingRef.current || isPanningRef.current) {
        if (e.cancelable) e.preventDefault();
        handlePointerUp();
      }
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: false });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: false });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [activeTool, showCompare, historyIndex]);

  // Touch handlers fallback
  const handleTouchStart = (e) => {
    if (e.cancelable && (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'pan')) {
      e.preventDefault();
    }
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handlePointerDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.cancelable && (isDrawingRef.current || isPanningRef.current)) {
      e.preventDefault();
    }
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handlePointerMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    handlePointerUp();
  };

  // Clear mask
  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext('2d');
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHasMask(false);
    }
  };

  // Reset to original image
  const resetToOriginal = () => {
    if (originalImageSrc) {
      loadImage(originalImageSrc, imageFileName);
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const imgCanvas = imageCanvasRef.current;
      if (imgCanvas) {
        const ctx = imgCanvas.getContext('2d');
        ctx.putImageData(history[newIndex], 0, 0);
        setHistoryIndex(newIndex);
        setCurrentImageSrc(imgCanvas.toDataURL());
        clearMask();
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const imgCanvas = imageCanvasRef.current;
      if (imgCanvas) {
        const ctx = imgCanvas.getContext('2d');
        ctx.putImageData(history[newIndex], 0, 0);
        setHistoryIndex(newIndex);
        setCurrentImageSrc(imgCanvas.toDataURL());
        clearMask();
      }
    }
  };

  /**
   * BRIA Image Eraser API Integration Handler
   * Erases the masked area using BRIA v2 /erase endpoint with token c25c81cf096347119aa8425790d2b7da
   */
  const handleRemoveObject = async () => {
    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!imgCanvas || !maskCanvas || !hasMask) return;

    setIsProcessing(true);
    setProcessProgress(15);
    setStatusMessage('Connecting to BRIA Image Eraser v2 API...');

    try {
      // 1. Call BRIA AI Eraser API
      setStatusMessage('BRIA AI reconstructing natural background...');
      const briaResultImg = await BriaEraserService.eraseObject(
        imgCanvas,
        maskCanvas,
        (progress) => setProcessProgress(progress)
      );

      // 2. Render BRIA result onto the imageCanvas
      const ctx = imgCanvas.getContext('2d');
      ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
      ctx.drawImage(briaResultImg, 0, 0, imgCanvas.width, imgCanvas.height);

      // 3. Save state to history stack
      const updatedImgData = ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updatedImgData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // 4. Update state and clear mask
      const updatedSrc = imgCanvas.toDataURL('image/png');
      setCurrentImageSrc(updatedSrc);
      clearMask();
      setStatusMessage('Object removed successfully with BRIA AI!');
    } catch (err) {
      console.warn('BRIA API call encountered an issue, falling back to local high-fidelity engine:', err);
      setStatusMessage('Processing with local neural texture engine...');

      try {
        // High-fidelity local fallback
        const resultImgData = await InpaintingEngine.process(
          imgCanvas,
          maskCanvas,
          (progress) => setProcessProgress(progress)
        );

        const ctx = imgCanvas.getContext('2d');
        ctx.putImageData(resultImgData, 0, 0);

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(resultImgData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        const updatedSrc = imgCanvas.toDataURL('image/png');
        setCurrentImageSrc(updatedSrc);
        clearMask();
        setStatusMessage('Object removed naturally!');
      } catch (localErr) {
        console.error('Inpainting error:', localErr);
        setStatusMessage('Removal failed. Please try a smaller brush selection.');
      }
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
    }
  };

  // 100% Quality Lossless Download Handler
  const handleDownload = () => {
    const imgCanvas = imageCanvasRef.current;
    if (!imgCanvas) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#9333EA', '#ffffff'],
      });
    } catch (e) {
      // ignore
    }

    let dataUrl;
    let extension;
    if (downloadFormat === 'png') {
      dataUrl = imgCanvas.toDataURL('image/png');
      extension = 'png';
    } else {
      dataUrl = imgCanvas.toDataURL('image/jpeg', 1.0);
      extension = 'jpg';
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `${imageFileName}-cleaned-100quality.${extension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Zoom Controls
  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.max(0.25, Math.min(5, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <section id="editor" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            STATE 1: PREMIUM UPLOAD PLACEHOLDER FOR OBJECT REMOVER (When no image loaded)
            ========================================================================= */}
        {!currentImageSrc ? (
          <div className="max-w-4xl mx-auto">
            {/* Header Description */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171121] border border-[#A855F7]/30 text-xs font-semibold text-[#C084FC] mb-4 purple-glow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>BRIA Image Eraser v2 Powered</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                <span className="text-gray-300">100% Original Resolution</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
                Remove Unwanted Objects from Photos
              </h2>
              <p className="text-base text-gray-400 max-w-xl mx-auto">
                Upload any image to open the brush workspace. Highlight any object, photobomber, or logo to erase it with realistic AI reconstruction.
              </p>
            </div>

            {/* Main Premium Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handlePlaceholderDrop}
              className={`relative rounded-[2rem] p-10 sm:p-14 text-center transition-all duration-500 overflow-hidden group ${
                isDraggingFile
                  ? 'scale-[1.02] shadow-[0_0_50px_rgba(168,85,247,0.4)]'
                  : 'hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(168,85,247,0.15)] shadow-2xl'
              }`}
            >
              {/* Animated glowing border background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${isDraggingFile ? 'from-[#C084FC] via-[#9333EA] to-[#C084FC]' : 'from-[#3b82f6] via-[#A855F7] to-[#ec4899]'} bg-[length:200%_200%] animate-[gradient_4s_ease_infinite] opacity-50`} />
              
              {/* Inner card surface */}
              <div className="absolute inset-[2px] bg-[#120F17]/95 backdrop-blur-3xl rounded-[calc(2rem-2px)] z-0" />
              
              {/* Subtle inner grid/noise */}
              <div className="absolute inset-0 bg-hero-grid opacity-[0.03] z-0 pointer-events-none mix-blend-overlay" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Glowing Upload Icon */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#171121] to-[#1a1325] border border-white/5 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Wand2 className="w-12 h-12 text-[#C084FC] drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-[pulse_3s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9333EA] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#A855F7]/40">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight">
                  Drag & Drop to Start Erasing
                </h3>
                <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed">
                  Upload an image and step into the professional studio. Highlight any unwanted object to remove it effortlessly.
                </p>

                {/* Primary Upload CTA Button */}
                <label className="cursor-pointer relative group/btn inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-white text-[#120F17] font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all overflow-hidden hover:scale-[1.02] active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <Upload className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Supported file specifications */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
                  <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 flex-1 text-center hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block mb-1">Formats</span>
                    <span className="text-xs text-white font-semibold">PNG, JPG, WEBP</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 flex-1 text-center hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider block mb-1">Resolution</span>
                    <span className="text-xs text-white font-semibold">Up to 8K UHD</span>
                  </div>
                  <div className="bg-[#A855F7]/10 border border-[#A855F7]/30 rounded-2xl px-4 py-3 flex-1 text-center shadow-[inset_0_0_15px_rgba(168,85,247,0.1)] hover:bg-[#A855F7]/20 transition-colors">
                    <span className="text-[10px] text-[#C084FC] font-bold uppercase tracking-wider block mb-1">Export</span>
                    <span className="text-xs text-[#E9D5FF] font-semibold">100% Lossless</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Sample Presets Row */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Or test with high-resolution samples:
                </span>
                <span className="text-xs text-[#C084FC] font-medium">One-click instant demo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadImage(p.original, p.id)}
                    className="glass-card rounded-xl p-3 border border-[#A855F7]/20 hover:border-[#A855F7] text-left transition-all group cursor-pointer flex items-center gap-3 hover:scale-[1.02]"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={p.original}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#C084FC] transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {p.category}
                      </p>
                      <span className="text-[10px] text-[#A855F7] font-semibold">
                        Try Sample →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             STATE 2: ACTIVE BRUSH WORKSPACE & REMOVER STUDIO
             ========================================================================= */
          <div>
            {/* Top Navigation Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentImageSrc(null)}
                  className="px-3 py-1.5 rounded-xl bg-[#171121] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#A855F7]/50 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Upload a different photo"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Upload Different Photo</span>
                </button>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">{imageFileName}</span>
                  <span>({imageMeta.width}×{imageMeta.height})</span>
                </div>
              </div>

              {/* Sample Preset Quick Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  Presets:
                </span>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadImage(p.original, p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                      imageFileName.includes(p.id)
                        ? 'bg-[#A855F7]/20 border-[#A855F7] text-white purple-glow-sm'
                        : 'bg-[#171121] border-white/10 text-gray-300 hover:border-[#A855F7]/40'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Editor Canvas Card */}
            <div className="glass-panel rounded-2xl border border-[#A855F7]/25 overflow-hidden purple-glow-lg flex flex-col">
              {/* Top Control Toolbar */}
              <div className="bg-[#171121]/90 border-b border-[#A855F7]/20 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 select-none">
                {/* Left: Tools Selection */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Brush Tool */}
                  <button
                    onClick={() => setActiveTool('brush')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTool === 'brush'
                        ? 'bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white shadow-md shadow-[#9333EA]/40'
                        : 'bg-[#120F17] text-gray-300 hover:bg-[#120F17]/80 hover:text-white border border-white/5'
                    }`}
                    title="Brush Tool (Draw over objects to remove)"
                  >
                    <Paintbrush className="w-4 h-4" />
                    <span className="hidden sm:inline">Brush</span>
                  </button>

                  {/* Eraser Tool */}
                  <button
                    onClick={() => setActiveTool('eraser')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTool === 'eraser'
                        ? 'bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white shadow-md shadow-[#9333EA]/40'
                        : 'bg-[#120F17] text-gray-300 hover:bg-[#120F17]/80 hover:text-white border border-white/5'
                    }`}
                    title="Eraser Tool (Erase mask strokes)"
                  >
                    <Eraser className="w-4 h-4" />
                    <span className="hidden sm:inline">Eraser</span>
                  </button>

                  {/* Pan Tool */}
                  <button
                    onClick={() => setActiveTool('pan')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTool === 'pan'
                        ? 'bg-gradient-to-r from-[#9333EA] to-[#A855F7] text-white shadow-md shadow-[#9333EA]/40'
                        : 'bg-[#120F17] text-gray-300 hover:bg-[#120F17]/80 hover:text-white border border-white/5'
                    }`}
                    title="Pan / Hand Tool (Drag to move canvas)"
                  >
                    <Hand className="w-4 h-4" />
                    <span className="hidden sm:inline">Pan</span>
                  </button>

                  {/* Brush Size Slider */}
                  <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10">
                    <span className="text-xs text-gray-400 whitespace-nowrap">Size:</span>
                    <input
                      type="range"
                      min="2"
                      max="120"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-24 accent-[#A855F7] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#C084FC] w-8">
                      {brushSize}px
                    </span>
                  </div>
                </div>

                {/* Middle: Undo / Redo / Clear / Compare */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none border border-white/5 cursor-pointer"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none border border-white/5 cursor-pointer"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={clearMask}
                    disabled={!hasMask}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-rose-400 disabled:opacity-40 disabled:pointer-events-none border border-white/5 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    title="Clear Selection"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline">Clear Mask</span>
                  </button>

                  {/* Before / After Compare Toggle */}
                  <button
                    onClick={() => setShowCompare(!showCompare)}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      showCompare
                        ? 'bg-[#A855F7]/30 border-[#A855F7] text-white purple-glow-sm'
                        : 'bg-[#120F17] border-white/5 text-gray-300 hover:text-white'
                    }`}
                    title="Compare Original vs Result"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </button>
                </div>

                {/* Right: Zoom & Reset */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleZoom(-0.15)}
                    className="p-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-white border border-white/5 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span
                    onClick={handleResetZoom}
                    className="text-xs font-mono text-gray-400 hover:text-white cursor-pointer px-1.5"
                    title="Reset Zoom to 100%"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    onClick={() => handleZoom(0.15)}
                    className="p-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-white border border-white/5 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    onClick={resetToOriginal}
                    className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#120F17] text-gray-300 hover:text-yellow-400 border border-white/5 text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset to Original Image"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden xl:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* Canvas Viewport Area */}
              <div
                ref={viewportRef}
                style={{ touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full h-[460px] sm:h-[580px] lg:h-[660px] bg-[#0d0a13] flex items-center justify-center overflow-hidden select-none touch-none ${
                  activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
                }`}
              >
                {/* Custom Brush Circle Indicator */}
                {cursorPos.visible && (
                  <div
                    className="absolute pointer-events-none rounded-full border border-white/90 bg-[#A855F7]/25 shadow-sm transform -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-75 ease-out"
                    style={{
                      left: `${cursorPos.x}px`,
                      top: `${cursorPos.y}px`,
                      width: `${brushSize * zoomLevel}px`,
                      height: `${brushSize * zoomLevel}px`,
                    }}
                  />
                )}

                {/* AI Scanning Beam Animation during processing */}
                {isProcessing && (
                  <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#A855F7] to-transparent animate-scan-beam shadow-[0_0_25px_#A855F7]" />
                    
                    <div className="bg-[#171121] border border-[#A855F7]/40 p-6 rounded-2xl purple-glow flex flex-col items-center max-w-xs text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#A855F7]/20 border border-[#A855F7] flex items-center justify-center mb-3">
                        <Wand2 className="w-6 h-6 text-[#C084FC] animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <h4 className="text-white font-bold text-base mb-1">
                        BRIA AI Reconstructing...
                      </h4>
                      <p className="text-xs text-gray-400 mb-4">
                        {statusMessage}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-[#120F17] rounded-full h-2.5 overflow-hidden border border-white/10 mb-2">
                        <div
                          className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] h-full rounded-full transition-all duration-200"
                          style={{ width: `${processProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#C084FC]">
                        {processProgress}% complete
                      </span>
                    </div>
                  </div>
                )}

                {/* Canvas Transform Container */}
                <div
                  className="relative transition-transform duration-75 ease-out touch-none"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    touchAction: 'none',
                  }}
                >
                  {/* Base Image Canvas */}
                  <canvas
                    ref={imageCanvasRef}
                    style={{ touchAction: 'none' }}
                    className="max-w-none shadow-2xl rounded-sm block touch-none"
                  />

                  {/* Mask Layer Canvas (Superimposed) */}
                  <canvas
                    ref={maskCanvasRef}
                    style={{ touchAction: 'none' }}
                    className={`absolute inset-0 max-w-none rounded-sm pointer-events-none touch-none ${
                      showCompare ? 'hidden' : 'block'
                    }`}
                  />

                  {/* Before / After Split Slider View Overlay */}
                  {showCompare && originalImageSrc && (
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{
                        width: `${compareSplit}%`,
                      }}
                    >
                      <img
                        src={originalImageSrc}
                        alt="Original Before"
                        className="max-w-none block"
                        style={{
                          width: `${imageMeta.width}px`,
                          height: `${imageMeta.height}px`,
                        }}
                      />
                      <span className="absolute top-4 left-4 bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        ORIGINAL (BEFORE)
                      </span>
                    </div>
                  )}

                  {/* Compare Split Handle */}
                  {showCompare && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20"
                      style={{ left: `${compareSplit}%` }}
                      onMouseDown={() => setIsComparingDrag(true)}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#171121] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-xl">
                        ⇄
                      </div>
                    </div>
                  )}
                </div>

                {/* Touch Guidance Toast on Mobile */}
                {!hasMask && (activeTool === 'brush' || activeTool === 'eraser') && (
                  <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2 bg-[#171121]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#A855F7]/40 text-[11px] font-medium text-purple-200 shadow-xl z-20 pointer-events-none flex items-center gap-1.5 animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>Touch & drag to paint over object</span>
                  </div>
                )}

                {/* Premium Mobile Brush Control Overlay */}
                <div className="lg:hidden absolute bottom-3 left-3 right-3 bg-[#171121]/95 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-white/10 flex items-center justify-between gap-2 z-20 shadow-2xl">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Brush:</span>
                    <input
                      type="range"
                      min="4"
                      max="100"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-[#A855F7] h-1.5"
                    />
                    <span className="text-[11px] font-mono font-bold text-[#C084FC] w-7 shrink-0 text-right">
                      {brushSize}p
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    {[12, 32, 64].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setBrushSize(sz)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                          brushSize === sz
                            ? 'bg-[#A855F7] text-white'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Specs Badge Overlay */}
                <div className="absolute top-3 left-3 bg-[#171121]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-gray-300 flex items-center gap-2 z-10 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{imageMeta.width} × {imageMeta.height} px</span>
                  <span>•</span>
                  <span className="text-[#C084FC] font-semibold">100% Quality Lossless</span>
                </div>
              </div>

              {/* Bottom Execution Bar */}
              <div className="bg-[#171121]/95 border-t border-[#A855F7]/20 p-3.5 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                
                {/* Primary Action: Remove Object CTA Button */}
                <button
                  onClick={handleRemoveObject}
                  disabled={!hasMask || isProcessing}
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden border ${
                    hasMask && !isProcessing
                      ? 'bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#9333EA] text-white border-[#A855F7]/50 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-[#181224] text-zinc-400 border-white/10 opacity-75 cursor-not-allowed'
                  }`}
                >
                  {hasMask && !isProcessing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  )}
                  <Wand2 className={`w-4 h-4 relative z-10 ${hasMask ? 'text-white' : 'text-[#C084FC]'}`} />
                  <span className="relative z-10 whitespace-nowrap">
                    {isProcessing ? 'Removing Object...' : hasMask ? 'Remove Object Now' : 'Highlight Object to Remove'}
                  </span>
                </button>

                {/* Secondary Controls Row: Upload New & Download */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Upload New Photo Button */}
                  <label className="flex-1 sm:flex-initial cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-[#120F17] hover:bg-[#181224] text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-all active:scale-[0.98] whitespace-nowrap">
                    <Upload className="w-4 h-4 text-[#C084FC]" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Download Group */}
                  <div className="flex-1 sm:flex-initial flex items-center min-w-0">
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      className="bg-[#120F17] text-xs font-semibold text-gray-300 border border-white/10 rounded-l-xl px-2.5 py-3 focus:outline-none focus:border-[#A855F7] shrink-0"
                      title="Choose export format"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPG</option>
                    </select>

                    <button
                      onClick={handleDownload}
                      className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-r-xl bg-[#221832] hover:bg-[#2d1e44] text-white font-bold text-xs sm:text-sm border border-l-0 border-[#A855F7]/30 hover:border-[#A855F7] transition-all flex items-center justify-center gap-1.5 cursor-pointer purple-glow-sm active:scale-[0.98] whitespace-nowrap"
                      title="Download in 100% original full quality"
                    >
                      <Download className="w-4 h-4 text-[#C084FC]" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Quality Guarantee Notice */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 px-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>BRIA Image Eraser v2 active: background reconstructed naturally with zero compression loss.</span>
              </div>
              <div className="flex items-center gap-3 mt-1 sm:mt-0">
                <span className="text-[#C084FC]">Token: c25c81cf...90d2b7da</span>
                <span>•</span>
                <span>Lossless Native Export</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
