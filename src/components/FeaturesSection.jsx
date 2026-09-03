import React from 'react';
import { Sparkles, ShieldCheck, Maximize, Sliders, Eye, RefreshCw } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Maximize,
      title: '100% Original Resolution',
      description: 'Zero lossy compression or pixel shrinkage. Upload a 4000×3000 photo and export at the exact 4000×3000 dimensions with full detail.',
      badge: 'LOSSLESS OUTPUT',
      colSpan: 'md:col-span-2',
    },
    {
      icon: Sliders,
      title: 'Surgical Brush Precision',
      description: 'Dynamic brush sizing from 2px up to 120px allows you to target micro watermarks, powerlines, or large crowds with sub-pixel accuracy.',
      badge: '2PX - 120PX BRUSH',
      colSpan: 'md:col-span-1',
    },
    {
      icon: Sparkles,
      title: 'Content-Aware Neural Inpainting',
      description: 'Analyzes neighboring textures, lighting vectors, and color gradients to reconstruct missing areas completely naturally.',
      badge: 'BRIA AI v2 ENGINE',
      colSpan: 'md:col-span-1',
    },
    {
      icon: ShieldCheck,
      title: '100% Private Client-Side Canvas',
      description: 'All canvas image processing runs directly inside your web browser. Your private images never leave your local device.',
      badge: 'ZERO SERVER UPLOADS',
      colSpan: 'md:col-span-2',
    },
    {
      icon: Eye,
      title: 'Interactive Split Review',
      description: 'Compare edits in real-time with an interactive Before / After slider divider before exporting high-resolution results.',
      badge: 'REALTIME REVIEW',
      colSpan: 'md:col-span-1',
    },
    {
      icon: RefreshCw,
      title: 'Unlimited Undo & Redo Stack',
      description: 'Full historical canvas state caching lets you experiment fearlessly. Step backwards and forwards through any number of edits.',
      badge: 'NON-DESTRUCTIVE',
      colSpan: 'md:col-span-2',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171322] border border-white/10 text-[11px] font-semibold text-zinc-300 tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Architected for Professionals</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Engineered for Flawless Output
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Every feature is built to give you total creative control, high-precision selection, and uncompressed quality output.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 100} className={feat.colSpan}>
                <div className="h-full bg-[#130f1c]/70 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group">
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C084FC] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>BUILT-IN STUDIO FEATURE</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
