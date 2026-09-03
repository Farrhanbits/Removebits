import React from 'react';
import { Wand2, Layers, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const TOOLS = [
  {
    id: 'object-remover',
    icon: Wand2,
    badge: 'BRIA AI ERASER V2',
    accentColor: '#A855F7',
    glowColor: 'rgba(168,85,247,0.2)',
    title: 'Object Removal Studio',
    subtitle: 'Surgically erase unwanted people, watermarks, wires, or photobombers with content-aware background synthesis.',
    features: ['Sub-pixel accuracy', 'Zero texture blur', 'Lossless 8K export'],
    cta: 'Launch Object Eraser',
    previewType: 'eraser',
  },
  {
    id: 'bg-remover',
    icon: Layers,
    badge: 'BRIA AI BG CUTOUT V2',
    accentColor: '#10B981',
    glowColor: 'rgba(16,185,129,0.2)',
    title: 'Background Removal',
    subtitle: 'Instant hair-level edge isolation and background transparency with crisp PNG output in under 2 seconds.',
    features: ['Auto edge isolation', 'Transparent PNG', 'Batch ready'],
    cta: 'Launch BG Remover',
    previewType: 'bg',
  },
  {
    id: 'image-enhancer',
    icon: Zap,
    badge: 'BRIA AI ENHANCE V2',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.2)',
    title: 'Image Enhancement',
    subtitle: 'Upscale low-res photos, sharpen micro details, reduce noise, and boost color dynamic range effortlessly.',
    features: ['AI detail sharpening', 'Noise reduction', 'Vivid color boost'],
    cta: 'Launch Quality Enhancer',
    previewType: 'enhance',
  },
];

export const ToolsHub = ({ onSelectTool }) => {
  const handleToolClick = (toolId) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    } else {
      window.location.hash = toolId;
    }
  };

  return (
    <section id="tools" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#A855F7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171322] border border-white/10 text-[11px] font-semibold text-zinc-300 tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Next-Gen Image Editing Suite</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Three Studio Tools.{' '}
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                One Clean Interface.
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Select any tool to open its dedicated studio workstation. Built with Bria AI engine for lossless precision.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid Tools Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <ScrollReveal key={tool.id} delay={idx * 120}>
                <div
                  onClick={() => handleToolClick(tool.id)}
                  className="group relative bg-[#130f1c]/70 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-[#181324]/80 cursor-pointer overflow-hidden"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Hover Glow Accent */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${tool.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Top Content */}
                  <div>
                    {/* Badge & Icon Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" style={{ color: tool.accentColor }} />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                        {tool.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-white transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                      {tool.subtitle}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-8 border-t border-white/5 pt-4">
                      {tool.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: tool.accentColor }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group-hover:text-[#C084FC] transition-colors">
                    <span>{tool.cta}</span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#A855F7] group-hover:border-[#A855F7] group-hover:text-white transition-all group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
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

export default ToolsHub;
