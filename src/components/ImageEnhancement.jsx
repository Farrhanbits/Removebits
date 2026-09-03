import React, { useState, useRef } from 'react';
import {
  Upload, Download, Zap, Sparkles, CheckCircle, RefreshCw,
  Image as ImageIcon, Eye, Sliders, ShieldCheck
} from 'lucide-react';
import { enhanceBriaImage } from '../utils/BriaEnhanceService';

export const ImageEnhancement = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [resultSrc, setResultSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [error, setError] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [splitPos, setSplitPos] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const compareRef = useRef(null);

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setError(null);
    setResultSrc(null);
    setShowCompare(false);
    setSplitPos(50);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files[0]);
  };

  const handleEnhance = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setStatusMsg('Sending to Bria AI Enhancement...');

    try {
      const resultImg = await enhanceBriaImage(imageSrc, (p) => {
        setProgress(p);
        if (p < 20) setStatusMsg('Sending to Bria AI...');
        else if (p < 40) setStatusMsg('AI job queued...');
        else if (p < 75) setStatusMsg('Bria AI enhancing details & sharpness...');
        else if (p < 92) setStatusMsg('Processing color & dynamic range...');
        else setStatusMsg('Finalizing enhanced output...');
      });

      const canvas = document.createElement('canvas');
      canvas.width = resultImg.naturalWidth || resultImg.width;
      canvas.height = resultImg.naturalHeight || resultImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(resultImg, 0, 0);
      setResultSrc(canvas.toDataURL('image/png'));
      setStatusMsg('Enhancement complete!');
    } catch (err) {
      console.error('Enhancement error:', err);
      setError(err.message || 'Enhancement failed. Please try again.');
      setStatusMsg('');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!resultSrc) return;
    const link = document.createElement('a');
    link.href = downloadFormat === 'png'
      ? resultSrc
      : (() => {
          const img = new Image(); img.src = resultSrc;
          const c = document.createElement('canvas');
          c.width = img.width; c.height = img.height;
          c.getContext('2d').drawImage(img, 0, 0);
          return c.toDataURL('image/jpeg', 1.0);
        })();
    link.download = `${fileName || 'enhanced'}-bria-enhanced.${downloadFormat === 'png' ? 'png' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setImageSrc(null);
    setResultSrc(null);
    setFileName('');
    setError(null);
    setShowCompare(false);
    setSplitPos(50);
  };

  // Drag the split handle in the compare slider
  const handleCompareDrag = (e) => {
    if (!isDraggingSplit || !compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setSplitPos(x);
  };

  return (
    <section id="enhancement" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171121] border border-[#A855F7]/30 text-xs font-bold text-[#C084FC] mb-5 purple-glow-sm">
            <Zap className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>BRIA AI Image Enhancement v2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-gray-300 font-medium">Professional Quality Upscale</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Enhance Image Quality
            <span className="block mt-1 bg-gradient-to-r from-yellow-300 via-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">
              With AI Precision
            </span>
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto">
            Powered by Farhanbits.dev — automatically boosts sharpness, detail, noise reduction, and dynamic range to deliver professional-grade enhanced imagery.
          </p>
        </div>

        {!imageSrc ? (
          /* ─── Premium Upload Placeholder ─── */
          <div className="max-w-3xl mx-auto">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-[2rem] p-10 sm:p-16 text-center transition-all duration-500 overflow-hidden group ${
                isDragging
                  ? 'scale-[1.02] shadow-[0_0_50px_rgba(234,179,8,0.3)]'
                  : 'hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(234,179,8,0.15)] shadow-2xl'
              }`}
            >
              {/* Animated glowing border background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${isDragging ? 'from-yellow-400 via-yellow-600 to-yellow-400' : 'from-[#9333EA] via-yellow-500 to-[#9333EA]'} bg-[length:200%_200%] animate-[gradient_4s_ease_infinite] opacity-50`} />
              
              {/* Inner card surface */}
              <div className="absolute inset-[2px] bg-[#120F17]/95 backdrop-blur-3xl rounded-[calc(2rem-2px)] z-0" />
              
              {/* Subtle inner grid/noise */}
              <div className="absolute inset-0 bg-hero-grid opacity-[0.03] z-0 pointer-events-none mix-blend-overlay" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Icon stack */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#171121] to-[#1a1325] border border-white/5 shadow-[0_0_40px_rgba(234,179,8,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-[pulse_3s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9333EA] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#A855F7]/40">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight">
                  Drag & Drop to Enhance Quality
                </h3>
                <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed">
                  Upload an image and let our enterprise-grade AI instantly upscale, sharpen, and recover details like magic.
                </p>

                <label className="cursor-pointer relative group/btn inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-white text-[#120F17] font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all overflow-hidden hover:scale-[1.02] active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <Upload className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Choose Image to Enhance</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => loadFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                {/* Feature badges */}
                <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-md">
                  {[
                    { icon: '🔬', label: 'AI Sharpening' },
                    { icon: '🌈', label: 'Color Boost' },
                    { icon: '🔇', label: 'Noise Removal' },
                  ].map((b) => (
                    <div key={b.label} className="bg-white/5 border border-white/5 rounded-2xl p-3.5 text-center hover:bg-white/10 transition-colors">
                      <span className="text-2xl block mb-2">{b.icon}</span>
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Active Enhancement Workspace ─── */
          <div className="max-w-6xl mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#171121] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#A855F7]/50 transition-all cursor-pointer"
              >
                ← Upload Different Photo
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-white font-medium">{fileName || 'image'}</span>
                {resultSrc && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-400 font-semibold">Enhancement complete ✓</span>
                  </>
                )}
              </div>
            </div>

            {/* Main workspace */}
            <div className="glass-panel border border-[#A855F7]/25 rounded-2xl overflow-hidden purple-glow-lg">
              {/* Toolbar */}
              <div className="bg-[#171121]/90 border-b border-[#A855F7]/20 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview</span>
                  {resultSrc && (
                    <button
                      onClick={() => setShowCompare(!showCompare)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                        showCompare
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-[#120F17] border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showCompare ? 'Result Only' : 'Compare Split'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {resultSrc && (
                    <>
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        className="bg-[#120F17] text-xs font-semibold text-gray-300 border border-white/10 rounded-l-lg px-2.5 py-2 focus:outline-none focus:border-[#A855F7]"
                      >
                        <option value="png">PNG (Lossless)</option>
                        <option value="jpeg">JPG (Max Quality)</option>
                      </select>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 rounded-r-lg bg-[#221832] hover:bg-[#2d1e44] text-white font-bold text-xs border border-l-0 border-[#A855F7]/30 hover:border-[#A855F7] transition-all flex items-center gap-1.5 cursor-pointer purple-glow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C084FC]" />
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Display: Side-by-side or Split compare */}
              {!showCompare || !resultSrc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#A855F7]/10">
                  {/* Original */}
                  <div className="relative bg-[#0d0a13] flex items-center justify-center min-h-[320px] sm:min-h-[440px] p-4">
                    <span className="absolute top-3 left-3 bg-[#171121]/90 border border-white/10 text-[11px] font-bold text-gray-300 px-2.5 py-1 rounded-lg uppercase tracking-wider z-10">
                      Original
                    </span>
                    <img
                      src={imageSrc}
                      alt="Original"
                      className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl"
                    />
                  </div>

                  {/* Enhanced Result */}
                  <div className="relative bg-[#0d0a13] flex items-center justify-center min-h-[320px] sm:min-h-[440px] p-4">
                    <span className="absolute top-3 left-3 bg-[#171121]/90 border border-white/10 text-[11px] font-bold text-gray-300 px-2.5 py-1 rounded-lg uppercase tracking-wider z-10">
                      {resultSrc ? '✨ Enhanced' : 'Result'}
                    </span>

                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-4 max-w-xs text-center">
                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center"
                          style={{ boxShadow: '0 0 25px -5px rgba(234,179,8,0.4)' }}>
                          <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm mb-1">{statusMsg}</p>
                          <p className="text-xs text-gray-400 mb-3">Bria AI processing...</p>
                          <div className="w-48 bg-[#120F17] rounded-full h-2 border border-white/10 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-[11px] font-mono text-yellow-400 mt-1">{progress}%</p>
                        </div>
                      </div>
                    ) : resultSrc ? (
                      <img
                        src={resultSrc}
                        alt="Enhanced"
                        className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-center opacity-50">
                        <Zap className="w-12 h-12 text-gray-500" />
                        <p className="text-sm text-gray-500">Your enhanced result will appear here</p>
                      </div>
                    )}

                    {error && (
                      <div className="absolute inset-4 flex items-center justify-center">
                        <div className="bg-red-950/80 border border-red-500/40 rounded-xl p-4 text-center max-w-xs">
                          <p className="text-red-400 text-sm font-semibold mb-1">Error</p>
                          <p className="text-red-300 text-xs">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ─── Compare Slider View ─── */
                <div
                  ref={compareRef}
                  className="relative select-none overflow-hidden min-h-[440px] flex items-center justify-center bg-[#0d0a13] cursor-col-resize"
                  onMouseMove={handleCompareDrag}
                  onMouseUp={() => setIsDraggingSplit(false)}
                  onMouseLeave={() => setIsDraggingSplit(false)}
                >
                  {/* Enhanced (full-width background) */}
                  <img src={resultSrc} alt="Enhanced" className="w-full h-full object-contain absolute inset-0 max-h-[500px] m-auto" />

                  {/* Original (clipped to left side) */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${splitPos}%` }}>
                    <img src={imageSrc} alt="Original" className="w-full h-full object-contain" style={{ width: `${100 / (splitPos / 100)}%`, maxWidth: 'none' }} />
                    <span className="absolute top-4 left-4 bg-[#171121]/90 text-[11px] font-bold text-gray-300 px-2 py-1 rounded-lg">ORIGINAL</span>
                  </div>

                  {/* Split handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20 cursor-col-resize"
                    style={{ left: `${splitPos}%` }}
                    onMouseDown={() => setIsDraggingSplit(true)}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#171121] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-xl">
                      ⇄
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500/50 text-[11px] font-bold text-yellow-300 px-2 py-1 rounded-lg">ENHANCED</span>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="bg-[#171121]/95 border-t border-[#A855F7]/20 px-5 py-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-400">
                    {resultSrc
                      ? '✨ Enhancement applied. Download or compare to see the difference.'
                      : 'Click "Enhance Image" to let Bria AI improve sharpness, color, and detail.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {resultSrc && (
                    <button
                      onClick={() => { setResultSrc(null); setError(null); }}
                      className="px-4 py-2.5 rounded-xl bg-[#120F17] text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Re-Enhance
                    </button>
                  )}
                  <button
                    onClick={handleEnhance}
                    disabled={isProcessing || !imageSrc}
                    className="relative group/action px-8 py-3 rounded-xl bg-white text-[#120F17] font-extrabold text-sm shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer overflow-hidden border border-yellow-500/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent -translate-x-full group-hover/action:animate-[shimmer_1.5s_infinite]" />
                    <Zap className="w-4 h-4 relative z-10 text-yellow-600" />
                    <span className="relative z-10">{isProcessing ? 'Enhancing...' : 'Enhance Image'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quality note */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 px-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />
                <span>Bria AI Enhancement v2 — AI-powered sharpness, noise reduction & color precision. Results vary by input quality.</span>
              </div>
              <span className="text-[#C084FC] mt-1 sm:mt-0">Token: 77184980...cec</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
