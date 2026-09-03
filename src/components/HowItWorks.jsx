import React from 'react';
import { Upload, Paintbrush, Wand2, Download, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Image',
      icon: Upload,
      description: 'Drag & drop any high-resolution photo. Images stay 100% private and are processed in browser memory.',
      badge: 'Up to 8K support',
    },
    {
      num: '02',
      title: 'Highlight Target',
      icon: Paintbrush,
      description: 'Adjust the brush size from 2px for small logos up to 120px for large photobombers and obstacles.',
      badge: 'Sub-pixel accuracy',
    },
    {
      num: '03',
      title: 'AI Synthesis',
      icon: Wand2,
      description: 'BRIA AI neural inpainting engine synthesizes background texture leaving zero trace of removal.',
      badge: 'Seamless texture blend',
    },
    {
      num: '04',
      title: 'Lossless Export',
      icon: Download,
      description: 'Export your clean photo in lossless PNG or uncompressed JPG at the exact original pixel dimensions.',
      badge: 'Zero quality loss',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative bg-[#0e0c14]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171322] border border-white/10 text-[11px] font-semibold text-zinc-300 tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Simple 4-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              From upload to pristine download in under 10 seconds. No Photoshop experience required.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.num} delay={idx * 120}>
                <div className="bg-[#130f1c]/70 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group h-full">
                  <div>
                    {/* Header Row: Icon & Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C084FC] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black font-mono text-white/20 group-hover:text-[#C084FC]/60 transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#C084FC]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                    <span>{step.badge}</span>
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

export default HowItWorks;
