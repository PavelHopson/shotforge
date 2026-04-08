import React, { useState } from 'react';
import { UserConfig, Gender, Emotion, Lighting, CameraAngle, Pose, Preset } from '../types';
import { PRESETS } from '../constants';
import { Button } from './Button';
import { Sliders, Sparkles, Crown, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getCustomPresets } from '../services/historyService';

interface ConfigPanelProps {
  config: UserConfig;
  setConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  onGenerate: () => void;
  isLoading: boolean;
  onCreatePreset: () => void;
  batchPresets: string[];
  onBatchToggle: (presetId: string) => void;
  batchMode: boolean;
  onBatchModeToggle: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config, setConfig, onGenerate, isLoading,
  onCreatePreset, batchPresets, onBatchToggle, batchMode, onBatchModeToggle
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const customPresets = getCustomPresets();
  const allPresets: Preset[] = [...PRESETS, ...customPresets];

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
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">
              1. Select Concept
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={onBatchModeToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  batchMode ? 'bg-sf-500 text-white' : 'bg-glass border border-glass-border text-dim hover:text-sf-200'
                }`}
                style={batchMode ? { boxShadow: '0 2px 8px rgba(124,58,237,0.25)' } : {}}
              >
                <Sparkles className="w-3 h-3" />
                Batch
              </button>
              <button
                onClick={onCreatePreset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-glass border border-glass-border text-dim hover:text-sf-200 hover:border-sf-700/50 transition-all"
              >
                <Plus className="w-3 h-3" />
                Свой
              </button>
            </div>
          </div>

          {batchMode && batchPresets.length > 0 && (
            <div className="mb-3 flex items-center gap-2 bg-sf-900/30 border border-sf-700/30 rounded-xl px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 text-sf-400" />
              <span className="text-xs text-sf-300 font-medium">
                Batch: {batchPresets.length} пресет{batchPresets.length > 1 ? (batchPresets.length < 5 ? 'а' : 'ов') : ''} выбрано
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allPresets.map(preset => {
              const isSelected = batchMode
                ? batchPresets.includes(preset.id)
                : config.presetId === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => batchMode ? onBatchToggle(preset.id) : updateConfig('presetId', preset.id)}
                  className={`
                    relative text-left p-1 rounded-xl transition-all duration-200 border-2
                    ${isSelected
                      ? 'border-sf-500 bg-sf-500/5'
                      : 'border-transparent hover:bg-glass-hover'
                    }
                  `}
                  style={isSelected ? { boxShadow: '0 2px 16px rgba(124,58,237,0.15)' } : {}}
                >
                  {/* Batch checkbox */}
                  {batchMode && (
                    <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isSelected ? 'bg-sf-500 border-sf-500' : 'bg-bg-2/80 border-glass-border'
                    } border`}
                      style={isSelected ? { boxShadow: '0 2px 8px rgba(124,58,237,0.4)' } : {}}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}

                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                    <img src={preset.image} alt={preset.name} className="w-full h-full object-cover opacity-80" />
                    {preset.isPro && (
                      <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-sf-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }}>
                        <Crown className="w-2.5 h-2.5" />
                        PRO
                      </span>
                    )}
                    {preset.isCustom && (
                      <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="px-1">
                    <div className="font-medium text-sm text-sf-100">{preset.name}</div>
                    <div className="text-xs text-dim line-clamp-1">{preset.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Basic Controls */}
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

        {/* Advanced Settings (collapsible) */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-glass border border-glass-border rounded-xl text-sm font-medium text-sf-200 hover:border-sf-800/50 transition-all"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sf-400" />
            Расширенные настройки
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-glass border border-glass-border rounded-2xl animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Pose</label>
              <select
                value={config.pose}
                onChange={(e) => updateConfig('pose', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              >
                {Object.values(Pose).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Background</label>
              <input
                type="text"
                value={config.background}
                onChange={(e) => updateConfig('background', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
                placeholder="e.g. City rooftop at sunset"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">Accessories</label>
              <input
                type="text"
                value={config.accessories}
                onChange={(e) => updateConfig('accessories', e.target.value)}
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
                placeholder="e.g. Vintage watch, leather briefcase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-200 mb-2">
                Image Count ({config.imageCount})
              </label>
              <input
                type="range" min="1" max="8" value={config.imageCount}
                onChange={(e) => updateConfig('imageCount', parseInt(e.target.value))}
                className="w-full h-2 bg-bg-3 rounded-lg appearance-none cursor-pointer accent-sf-500"
              />
              <div className="flex justify-between text-[10px] text-dim mt-1">
                <span>1</span>
                <span>4</span>
                <span>8</span>
              </div>
            </div>
          </div>
        )}
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
              <span className="text-sf-100 font-medium">
                {batchMode
                  ? `${batchPresets.length} пресетов`
                  : allPresets.find(p => p.id === config.presetId)?.name
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dim">Images</span>
              <span className="text-sf-100 font-medium">
                {batchMode ? `${batchPresets.length * config.imageCount} total` : config.imageCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dim">Model</span>
              <span className="text-sf-100 font-medium">Gemini 3 Pro</span>
            </div>
            {config.pose !== 'Natural / Relaxed' && (
              <div className="flex justify-between text-sm">
                <span className="text-dim">Pose</span>
                <span className="text-sf-100 font-medium">{config.pose}</span>
              </div>
            )}
            <div className="h-px bg-glass-border my-4"></div>
            <div className="flex justify-between text-base">
              <span className="text-sf-200">Total</span>
              <span className="text-sf-50 font-bold">Free</span>
            </div>
          </div>

          <Button
            onClick={onGenerate}
            isLoading={isLoading}
            size="lg"
            className="w-full text-base font-bold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {batchMode
              ? `Generate Batch (${batchPresets.length})`
              : 'Generate Photos'
            }
          </Button>
          <p className="text-center text-xs text-dim mt-3">
            Powered by Gemini AI. Free with your API key.
          </p>
        </div>
      </div>
    </div>
  );
};
