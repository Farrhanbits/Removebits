import React from 'react';
import { ArrowLeft, Wand2, Layers, Zap, Sparkles, Home } from 'lucide-react';

export const ToolStudioHeader = ({ activeTool, onSelectTool, onBackHome }) => {
  const tools = [
    {
      id: 'object-remover',
      label: 'Object Removal',
      icon: Sparkles,
      color: 'text-[#C084FC]',
      border: 'border-[#A855F7]/40 bg-[#A855F7]/10',
    },
    {
      id: 'bg-remover',
      label: 'Background Removal',
      icon: Layers,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40 bg-emerald-500/10',
    },
    {
      id: 'image-enhancer',
      label: 'Image Enhancement',
      icon: Zap,
      color: 'text-amber-400',
      border: 'border-amber-500/40 bg-amber-500/10',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0e0c14]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Back Home button & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Landing Page</span>
            <Home className="w-3.5 h-3.5 sm:hidden" />
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Logo */}
          <div
            onClick={onBackHome}
            className="flex items-center gap-2 cursor-pointer hidden md:flex"
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
              <Wand2 className="w-3.5 h-3.5 text-[#C084FC]" />
            </div>
            <span className="font-extrabold text-sm text-white">
              Remove<span className="text-[#A855F7]">bits</span>
            </span>
          </div>
        </div>

        {/* Center: Tool Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#151120] p-1 rounded-xl border border-white/10">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white shadow-md border border-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? t.color : ''}`} />
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: AI Engine Status */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BRIA AI Engine Active (Lossless)</span>
        </div>

      </div>
    </header>
  );
};

export default ToolStudioHeader;
