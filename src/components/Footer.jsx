import React from 'react';
import { Wand2, ArrowUp } from 'lucide-react';

export const Footer = ({ onSelectTool }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToolClick = (toolId) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    } else {
      window.location.hash = toolId;
    }
  };

  return (
    <footer className="bg-[#0b0910] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#A855F7]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-[#C084FC]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Remove<span className="text-[#A855F7]">bits</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mb-5">
              The premier AI-powered image editing workspace for removing unwanted objects, backgrounds, and clutter with 100% lossless resolution quality.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All inpainting runs client-side in browser</span>
            </div>
          </div>

          {/* Col 2: AI Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              AI Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => handleToolClick('object-remover')}
                  className="hover:text-[#C084FC] transition-colors text-left cursor-pointer"
                >
                  Object Removal Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('bg-remover')}
                  className="hover:text-[#C084FC] transition-colors text-left cursor-pointer"
                >
                  Background Removal
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleToolClick('image-enhancer')}
                  className="hover:text-[#C084FC] transition-colors text-left cursor-pointer"
                >
                  Image Enhancement
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quality Commitment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Quality Commitment
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">✓</span> 100% Original Resolution
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">✓</span> Zero Quality Compression
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">✓</span> Local Browser Privacy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">✓</span> Lossless PNG / JPG Export
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left: Copyright */}
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-start">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} Removebits Studio. All rights reserved.
            </p>
          </div>

          {/* Center: Premium Developer Branding */}
          <div className="w-full sm:w-1/3 flex justify-center">
            <div className="relative group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#130f1c] border border-white/10 shadow-lg hover:border-white/20 transition-all overflow-hidden">
              <span className="text-xs font-medium text-zinc-400">
                A Project by
              </span>
              <a 
                href="https://farhanbits.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-wide bg-gradient-to-r from-purple-200 via-[#C084FC] to-purple-300 bg-clip-text text-transparent"
              >
                FarhanBits.dev
              </a>
            </div>
          </div>

          {/* Right: Back to top button */}
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-end">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2 text-xs"
              title="Scroll to Top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
