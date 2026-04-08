import React from 'react';
import { Camera, Sparkles, Settings, ScanFace, Aperture, Palette, HelpCircle } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onSettingsOpen: () => void;
  onGuideOpen: () => void;
}

const MODE_TABS: { mode: AppMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'photographer', label: 'AI Фотограф', icon: <Aperture className="w-3.5 h-3.5" /> },
  { mode: 'face-fusion', label: 'Face Fusion', icon: <ScanFace className="w-3.5 h-3.5" /> },
  { mode: 'style-transfer', label: 'Стиль', icon: <Palette className="w-3.5 h-3.5" /> },
];

export const Header: React.FC<HeaderProps> = ({ mode, onModeChange, onSettingsOpen, onGuideOpen }) => {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-glass-border" style={{ background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-sf-500 to-sf-400" style={{ boxShadow: '0 2px 12px rgba(124,58,237,0.25)' }}>
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-sf-50">
            Shot<span className="text-sf-400">forge</span>
          </span>
        </div>

        {/* Mode Tabs */}
        <nav className="hidden md:flex items-center gap-0.5 bg-bg-3/80 border border-glass-border rounded-xl p-1">
          {MODE_TABS.map((tab) => (
            <button
              key={tab.mode}
              onClick={() => onModeChange(tab.mode)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                mode === tab.mode
                  ? 'bg-sf-500 text-white shadow-lg'
                  : 'text-dim hover:text-sf-200 hover:bg-glass-hover'
              }`}
              style={mode === tab.mode ? { boxShadow: '0 2px 12px rgba(124,58,237,0.3)' } : {}}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <button onClick={onGuideOpen} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors" title="Быстрый старт">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button onClick={onSettingsOpen} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors" title="Настройки AI">
            <Settings className="w-4.5 h-4.5" />
          </button>
          <div className="flex items-center gap-1.5 bg-sf-900/40 border border-sf-800/50 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-sf-400" />
            <span className="text-xs font-medium text-sf-300">Multi-AI</span>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden border-t border-glass-border px-3 py-2 flex gap-1 overflow-x-auto">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.mode}
            onClick={() => onModeChange(tab.mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              mode === tab.mode ? 'bg-sf-500 text-white' : 'text-dim bg-bg-3'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
