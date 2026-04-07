import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Check } from 'lucide-react';
import { AIProviderConfig, AIProvider, PROVIDER_MODELS } from '../types';
import { getAIConfig, saveAIConfig } from '../services/geminiService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  openrouter: 'OpenRouter'
};

const PROVIDER_DESCRIPTIONS: Record<AIProvider, string> = {
  gemini: 'Best for image generation & face fusion. Supports Gemini 2.5 Flash/Pro.',
  openai: 'DALL-E 3 and GPT-4o for text-to-image and analysis.',
  openrouter: 'Access multiple providers through a single API. Pay-per-token.'
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIProviderConfig>(getAIConfig());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getAIConfig());
      setSaved(false);
    }
  }, [isOpen]);

  const handleProviderChange = (provider: AIProvider) => {
    const models = PROVIDER_MODELS[provider];
    setConfig(prev => ({
      ...prev,
      provider,
      model: models[0]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    saveAIConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">AI Provider Settings</h2>
            <p className="text-xs text-zinc-500 mt-1">Configure your preferred AI model and API key</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`
                    p-3 rounded-xl border-2 text-center transition-all duration-200
                    ${config.provider === provider
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                    }
                  `}
                >
                  <div className="text-sm font-semibold">{PROVIDER_LABELS[provider]}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-2">{PROVIDER_DESCRIPTIONS[config.provider]}</p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Model
            </label>
            <select
              value={config.model}
              onChange={(e) => { setConfig(prev => ({ ...prev, model: e.target.value })); setSaved(false); }}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {PROVIDER_MODELS[config.provider].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => { setConfig(prev => ({ ...prev, apiKey: e.target.value })); setSaved(false); }}
                placeholder={`Enter your ${PROVIDER_LABELS[config.provider]} API key`}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">
              Stored locally in your browser. Never sent to our servers.
            </p>
          </div>

          {/* Active Status */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Active Configuration</p>
                <p className="text-sm text-white font-medium mt-1">
                  {PROVIDER_LABELS[config.provider]} / {config.model}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${config.apiKey ? 'bg-green-500' : 'bg-zinc-600'}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`
              px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${saved
                ? 'bg-green-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }
            `}
          >
            {saved ? (
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Saved</span>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
