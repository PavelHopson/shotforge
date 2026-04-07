import React from 'react';
import { Camera, Sparkles, Settings, ScanFace, Aperture, Palette } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onSettingsOpen: () => void;
}

const MODE_TABS: { mode: AppMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'photographer', label: 'AI Photographer', icon: <Aperture className="w-3.5 h-3.5" /> },
  { mode: 'face-fusion', label: 'Face Fusion', icon: <ScanFace className="w-3.5 h-3.5" /> },
  { mode: 'style-transfer', label: 'Style Transfer', icon: <Palette className="w-3.5 h-3.5" /> },
];

export const Header: React.FC<HeaderProps> = ({ mode, onModeChange, onSettingsOpen }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Shotforge<span className="text-indigo-500">.ai</span></span>
        </div>

        {/* Mode Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-lg p-1">
          {MODE_TABS.map((tab) => (
            <button
              key={tab.mode}
              onClick={() => onModeChange(tab.mode)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                ${mode === tab.mode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onSettingsOpen}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="AI Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-indigo-400">
            <Sparkles className="w-3 h-3" />
            <span>Multi-AI</span>
          </div>
        </div>
      </div>

      {/* Mobile mode selector */}
      <div className="md:hidden border-t border-zinc-900 px-4 py-2 flex gap-1 overflow-x-auto">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.mode}
            onClick={() => onModeChange(tab.mode)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all
              ${mode === tab.mode
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-500 bg-zinc-900'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};