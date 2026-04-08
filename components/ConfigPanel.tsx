import React from 'react';
import { UserConfig, Gender, Emotion, Lighting, CameraAngle } from '../types';
import { PRESETS } from '../constants';
import { Button } from './Button';
import { Sliders, Sparkles, Crown } from 'lucide-react';

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
          <h2 className="text-2xl font-bold text-sf-50 flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-sf-400" />
            </div>
            Studio Configuration
          </h2>
          <p className="text-dim text-sm">Fine-tune your session. Gemini will direct the details.</p>
        </div>

        {/* Presets Grid */}
        <section>
          <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-4">
            1. Select Concept
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => updateConfig('presetId', preset.id)}
                className={`
                  relative text-left p-1 rounded-xl transition-all duration-200 border-2
                  ${config.presetId === preset.id
                    ? 'border-sf-500 bg-sf-500/5'
                    : 'border-transparent hover:bg-glass-hover'
                  }
                `}
                style={config.presetId === preset.id ? { boxShadow: '0 2px 16px rgba(124,58,237,0.15)' } : {}}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                  <img src={preset.image} alt={preset.name} className="w-full h-full object-cover opacity-80" />
                  {preset.isPro && (
                    <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-sf-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }}>
                      <Crown className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </div>
                <div className="px-1">
                  <div className="font-medium text-sm text-sf-100">{preset.name}</div>
                  <div className="text-xs text-dim line-clamp-1">{preset.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Detailed Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-glass border border-glass-border rounded-2xl">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Subject Gender</label>
              <div className="flex gap-2">
                {Object.values(Gender).map((g) => (
                  <button
                    key={g}
                    onClick={() => updateConfig('gender', g)}
                    className={`flex-1 py-2 text-sm rounded-xl border transition-all duration-200 ${
                      config.gender === g
                        ? 'bg-sf-500 border-sf-500 text-white'
                        : 'border-glass-border text-dim hover:border-sf-700/50 hover:text-sf-200'
                    }`}
                    style={config.gender === g ? { boxShadow: '0 2px 12px rgba(124,58,237,0.25)' } : {}}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Age ({config.age})</label>
              <input
                type="range" min="18" max="80" value={config.age}
                onChange={(e) => updateConfig('age', parseInt(e.target.value))}
                className="w-full h-2 bg-bg-3 rounded-lg appearance-none cursor-pointer accent-sf-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Clothing Style</label>
              <input
                type="text"
                value={config.clothing}
                onChange={(e) => updateConfig('clothing', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
                placeholder="e.g. Black Turtleneck"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Emotion</label>
              <select
                value={config.emotion}
                onChange={(e) => updateConfig('emotion', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              >
                {Object.values(Emotion).map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Lighting</label>
              <select
                value={config.lighting}
                onChange={(e) => updateConfig('lighting', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              >
                {Object.values(Lighting).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Camera Lens</label>
              <select
                value={config.camera}
                onChange={(e) => updateConfig('camera', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              >
                {Object.values(CameraAngle).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Summary & Action */}
      <div className="lg:w-96 shrink-0">
        <div
          className="sticky top-24 border border-glass-border rounded-2xl p-6 shadow-2xl"
          style={{ background: 'rgba(10,10,16,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <h3 className="text-lg font-bold text-sf-50 mb-6">Session Summary</h3>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-dim">Concept</span>
              <span className="text-sf-100 font-medium">{PRESETS.find(p => p.id === config.presetId)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dim">Model</span>
              <span className="text-sf-100 font-medium">Flux.1 Pro</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dim">Resolution</span>
              <span className="text-sf-100 font-medium">4K (Upscaled)</span>
            </div>
            <div className="h-px bg-glass-border my-4"></div>
            <div className="flex justify-between text-base">
              <span className="text-sf-200">Total</span>
              <span className="text-sf-50 font-bold">$9.00</span>
            </div>
          </div>

          <Button
            onClick={onGenerate}
            isLoading={isLoading}
            size="lg"
            className="w-full text-base font-bold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Photos
          </Button>
          <p className="text-center text-xs text-dim mt-3">
            Secure payment via Stripe. 100% Satisfaction guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};
