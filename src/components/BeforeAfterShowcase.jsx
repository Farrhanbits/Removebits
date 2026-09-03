import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { getSamplePresets } from '../data/samplePresets';
import { ScrollReveal } from './ScrollReveal';

const ShowcaseCard = ({ title, category, description, original, clean, onSelectTool }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleLoadClick = () => {
    if (onSelectTool) {
      onSelectTool('object-remover');
    } else {
      window.location.hash = 'object-remover';
    }
  };

  return (
    <div className="bg-[#130f1c]/70 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl group">
      {/* Interactive Before/After viewport */}
      <div
        className="relative h-60 sm:h-64 rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10 mb-5 bg-[#0a0810]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (isDragging || e.buttons === 1) {
            handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
          }
        }}
      >
        {/* Clean Background (After) */}
        <img
          src={clean}
          alt={`${title} Clean`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 z-10 backdrop-blur-md">
          CLEAN RESULT
        </span>

        {/* Original with object (Before) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={original}
            alt={`${title} Original`}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%' }}
          />
          <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 z-10 backdrop-blur-md">
            ORIGINAL PHOTO
          </span>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#181324] border border-white flex items-center justify-center text-white text-[10px] font-bold shadow-xl">
            ⇄
          </div>
        </div>
      </div>

      {/* Info details */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold text-[#C084FC] uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {category}
          </span>
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Quality Preservation
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5">
          {description}
        </p>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px] text-zinc-500 font-mono">DRAG SLIDER TO VERIFY</span>
          <button
            onClick={handleLoadClick}
            className="text-white hover:text-[#C084FC] font-bold flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-all"
          >
            <span>Try in Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C084FC]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfterShowcase = ({ onSelectTool }) => {
  const presets = getSamplePresets();

  return (
    <section id="showcase" className="py-20 md:py-28 relative bg-[#0e0c14]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171322] border border-white/10 text-[11px] font-semibold text-zinc-300 tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Real Interactive Results</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Uncompromising Image Fidelity
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Drag the interactive sliders below to inspect how our AI engine reconstructs textures, reflections, and fine shadows seamlessly.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 120}>
              <ShowcaseCard {...item} onSelectTool={onSelectTool} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;
