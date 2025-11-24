import React from 'react';
import { ArrowRight, Aperture, Clock, Zap } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Now Live: Flux.1 Pro Model
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-8 max-w-4xl mx-auto leading-[1.1]">
          Professional photoshoot <br className="hidden sm:block" />
          in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">3 minutes</span>.
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Skip the $2,000 photographer fee. Upload a selfie and let our AI director (Gemini 3 Pro) engineer the perfect studio shots for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto group">
            Start Your Session
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            View Gallery
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center gap-2">
            <Aperture className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="font-semibold text-white">Hyper-Realistic</h3>
            <p className="text-sm text-zinc-500">Flux.1 Pro + SDXL engines</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="font-semibold text-white">Ready in 180s</h3>
            <p className="text-sm text-zinc-500">Fast GPU processing</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-500 mb-2" />
            <h3 className="font-semibold text-white">AI Director</h3>
            <p className="text-sm text-zinc-500">Gemini prompted lighting</p>
          </div>
        </div>
      </div>
    </div>
  );
};