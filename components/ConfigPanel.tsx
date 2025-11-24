import React from 'react';
import { UserConfig, Gender, Emotion, Lighting, CameraAngle } from '../types';
import { PRESETS } from '../constants';
import { Button } from './Button';
import { Sliders, Sparkles } from 'lucide-react';

interface ConfigPanelProps {
  config: UserConfig;
  setConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  
  const updateConfig = (key: keyof UserConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Left Column: Controls */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
            <Sliders className="w-6 h-6 text-indigo-500" />
            Studio Configuration
          </h2>
          <p className="text-zinc-400 text-sm">Fine-tune your session. Gemini will direct the details.</p>
        </div>

        {/* Presets Grid */}
        <section>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            1. Select Concept
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => updateConfig('presetId', preset.id)}
                className={`
                  relative text-left p-1 rounded-xl transition-all duration-200 border-2
                  ${config.presetId === preset.id ? 'border-indigo-500 bg-zinc-900' : 'border-transparent hover:bg-zinc-900'}
                `}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                  <img src={preset.image} alt={preset.name} className="w-full h-full object-cover opacity-80" />
                  {preset.isPro && (
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
                  )}
                </div>
                <div className="px-1">
                  <div className="font-medium text-sm text-zinc-100">{preset.name}</div>
                  <div className="text-xs text-zinc-500 line-clamp-1">{preset.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Detailed Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Subject Gender</label>
              <div className="flex gap-2">
                {Object.values(Gender).map((g) => (
                  <button
                    key={g}
                    onClick={() => updateConfig('gender', g)}
                    className={`flex-1 py-2 text-sm rounded-lg border ${config.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Age ({config.age})</label>
              <input 
                type="range" min="18" max="80" value={config.age} 
                onChange={(e) => updateConfig('age', parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Clothing Style</label>
              <input 
                type="text" 
                value={config.clothing}
                onChange={(e) => updateConfig('clothing', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. Black Turtleneck"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Emotion</label>
              <select 
                value={config.emotion}
                onChange={(e) => updateConfig('emotion', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {Object.values(Emotion).map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Lighting</label>
              <select 
                value={config.lighting}
                onChange={(e) => updateConfig('lighting', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {Object.values(Lighting).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Camera Lens</label>
              <select 
                value={config.camera}
                onChange={(e) => updateConfig('camera', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {Object.values(CameraAngle).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Summary & Action */}
      <div className="lg:w-96 shrink-0">
        <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Session Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Concept</span>
              <span className="text-white font-medium">{PRESETS.find(p => p.id === config.presetId)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Model</span>
              <span className="text-white font-medium">Flux.1 Pro</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Resolution</span>
              <span className="text-white font-medium">4K (Upscaled)</span>
            </div>
            <div className="h-px bg-zinc-800 my-4"></div>
            <div className="flex justify-between text-base">
              <span className="text-zinc-300">Total</span>
              <span className="text-white font-bold">$9.00</span>
            </div>
          </div>

          <Button 
            onClick={onGenerate} 
            isLoading={isLoading} 
            size="lg" 
            className="w-full text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Photos
          </Button>
          <p className="text-center text-xs text-zinc-500 mt-3">
            Secure payment via Stripe. 100% Satisfaction guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};