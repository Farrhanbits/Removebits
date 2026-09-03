import React from 'react';
import GradientWaves from './GradientWaves';
import { ScrollReveal } from './ScrollReveal';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export const HeroSection = ({ onSelectTool }) => {
  const handleStartClick = () => {
    if (onSelectTool) {
      onSelectTool('object-remover');
    } else {
      window.location.hash = 'object-remover';
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-28 md:pt-32 overflow-hidden bg-[#0d0a14]">
      {/* 640px Gradient Waves Banner Container */}
      <div style={{ width: '100%', height: '640px', position: 'relative' }}>
        {/* WebGL Canvas Component */}
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />

        {/* Ultra-Smooth Seamless Fade Gradient into Deep Dark Background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[380px] pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(13, 10, 20, 0) 0%, rgba(13, 10, 20, 0.12) 20%, rgba(13, 10, 20, 0.38) 45%, rgba(13, 10, 20, 0.72) 70%, rgba(13, 10, 20, 0.94) 88%, #0d0a14 100%)',
          }}
        />

        {/* Centered Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20">
          <div className="pointer-events-auto flex flex-col items-center max-w-4xl">
            
            <ScrollReveal direction="down" duration={600}>
              {/* Refined Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181324]/80 backdrop-blur-xl border border-white/10 text-xs text-white mb-6 shadow-xl">
                <span className="bg-white text-[#120F17] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI STUDIO
                </span>
                <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                  Removebits Studio v2.0
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100} duration={700}>
              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-xl">
                <span className="block">Remove Unwanted Objects</span>
                <span className="block mt-1">
                  Instantly with{' '}
                  <span className="bg-gradient-to-r from-white via-purple-200 to-[#C084FC] bg-clip-text text-transparent">
                    Removebits
                  </span>
                  .
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200} duration={700}>
              <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
                Professional Bria AI image editing tools for object erasing, background removal, and resolution enhancement — all with 100% lossless pixel quality.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} duration={700}>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <button
                  onClick={handleStartClick}
                  className="relative group px-8 py-3.5 rounded-xl bg-white text-[#120F17] font-extrabold text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Open Studio
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="group px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-md border border-white/10 hover:border-white/20 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-purple-300 fill-purple-300" />
                  <span>See How It Works</span>
                </button>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
