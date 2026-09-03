import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Menu, X, ArrowRight, Layers, Zap, ChevronDown } from 'lucide-react';

export const Header = ({ onSelectTool, onNavigateHome, currentRoute = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToolNavigate = (toolId) => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    if (onSelectTool) {
      onSelectTool(toolId);
    } else {
      window.location.hash = toolId;
    }
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    if (currentRoute !== 'home') {
      if (onNavigateHome) onNavigateHome();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0c0a10] border-b border-white/5 py-2.5 overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A855F7]/10 to-transparent animate-[shimmer_4s_infinite] -translate-x-full" />
        
        <p className="text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2.5 z-10">
          <span className="text-zinc-300">
            All AI Tools Free for a Limited Time — 
            <span className="font-bold bg-gradient-to-r from-purple-200 via-[#C084FC] to-purple-400 bg-clip-text text-transparent ml-1">
              Lossless 8K Precision Output
            </span>
          </span>
        </p>
      </div>

      {/* Floating Header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out flex justify-center px-4 sm:px-6 lg:px-8 ${
          scrolled ? 'top-[50px]' : 'top-[58px]'
        }`}
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <div className="w-full max-w-7xl relative">
          
          <div className={`w-full flex items-center justify-between transition-all duration-500 rounded-2xl px-5 ${
            scrolled 
              ? 'bg-[#14101e]/85 backdrop-blur-xl border border-white/10 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
              : 'bg-[#14101e]/60 backdrop-blur-lg border border-white/10 py-3.5 shadow-xl'
          }`}>
            
            {/* Brand Logo */}
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-[#A855F7]">
                <Wand2 className="w-4 h-4 text-[#C084FC] group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  Remove<span className="text-[#A855F7]">bits</span>
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#C084FC] hidden sm:block">
                  PRO
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              
              {/* Mega Menu Trigger */}
              <button 
                onMouseEnter={() => setMegaMenuOpen(true)}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  megaMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-[#C084FC]' : ''}`} />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-3.5 py-2 rounded-xl hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-3.5 py-2 rounded-xl hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="px-3.5 py-2 rounded-xl hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* Action Button */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => handleToolNavigate('object-remover')}
                className="relative group px-5 py-2 rounded-xl bg-white text-[#120F17] text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:bg-purple-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mega Menu Dropdown */}
          <div 
            className={`absolute top-full left-0 w-full pt-3 transition-all duration-300 origin-top ${
              megaMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
            }`}
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <div className="w-full p-6 rounded-2xl bg-[#14101e]/95 backdrop-blur-2xl border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-5 relative overflow-hidden">
              
              {/* Tool 1: Object Removal */}
              <div 
                onClick={() => handleToolNavigate('object-remover')}
                className="group/card relative p-5 rounded-xl border border-white/10 bg-[#0e0b16]/70 transition-all duration-300 hover:border-white/20 hover:bg-[#181324] cursor-pointer flex flex-col items-start"
              >
                <div className="w-10 h-10 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C084FC]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold text-base mb-1.5 group-hover/card:text-[#C084FC] transition-colors">Object Removal Studio</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Surgically erase unwanted people, logos, or clutter with content-aware background synthesis.</p>
              </div>

              {/* Tool 2: BG Removal */}
              <div 
                onClick={() => handleToolNavigate('bg-remover')}
                className="group/card relative p-5 rounded-xl border border-white/10 bg-[#0e0b16]/70 transition-all duration-300 hover:border-white/20 hover:bg-[#181324] cursor-pointer flex flex-col items-start"
              >
                <div className="w-10 h-10 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold text-base mb-1.5 group-hover/card:text-emerald-400 transition-colors">Background Removal</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Instant subject isolation with crisp transparent PNG output in under 2 seconds.</p>
              </div>

              {/* Tool 3: Image Enhance */}
              <div 
                onClick={() => handleToolNavigate('image-enhancer')}
                className="group/card relative p-5 rounded-xl border border-white/10 bg-[#0e0b16]/70 transition-all duration-300 hover:border-white/20 hover:bg-[#181324] cursor-pointer flex flex-col items-start"
              >
                <div className="w-10 h-10 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold text-base mb-1.5 group-hover/card:text-amber-400 transition-colors">Image Enhancement</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Upscale low-res photos, sharpen micro details, and boost dynamic color range.</p>
              </div>

            </div>
          </div>

          {/* Mobile Menu Dropdown with Responsive Gap */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 w-full bg-[#14101e]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-2 text-sm font-medium text-zinc-200">
                <div className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1 ml-2">Studio Tools</div>
                
                <button
                  onClick={() => handleToolNavigate('object-remover')}
                  className="text-left px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between border border-white/10 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A855F7]/20 border border-[#A855F7]/40 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#C084FC]" />
                    </div>
                    <span className="font-bold text-white">Object Removal Studio</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                <button
                  onClick={() => handleToolNavigate('bg-remover')}
                  className="text-left px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between border border-white/10 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-bold text-white">Background Removal</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                <button
                  onClick={() => handleToolNavigate('image-enhancer')}
                  className="text-left px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between border border-white/10 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-bold text-white">Image Enhancement</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                
                <div className="h-px bg-white/10 my-2" />
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-center py-2.5 px-2 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold hover:bg-white/10 text-zinc-300"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-center py-2.5 px-2 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold hover:bg-white/10 text-zinc-300"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('faq')}
                    className="text-center py-2.5 px-2 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold hover:bg-white/10 text-zinc-300"
                  >
                    FAQ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
