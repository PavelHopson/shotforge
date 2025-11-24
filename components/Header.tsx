import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Shotforge<span className="text-indigo-500">.ai</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it works</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Gallery</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-400 hover:text-white hidden sm:block">Log in</button>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-indigo-400">
            <Sparkles className="w-3 h-3" />
            <span>Gemini 3 Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
};