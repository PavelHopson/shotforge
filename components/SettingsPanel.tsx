import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Check, ExternalLink } from 'lucide-react';
import { AIProviderConfig, AIProvider, PROVIDER_MODELS } from '../types';
import { getAIConfig, saveAIConfig } from '../services/geminiService';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  openrouter: 'OpenRouter',
  ollama: 'Ollama'
};

const PROVIDER_DESCRIPTIONS: Record<AIProvider, string> = {
  gemini: 'Best for image generation & face fusion. Supports Gemini 2.5 Flash/Pro.',
  openai: 'DALL-E 3 and GPT-4o for text-to-image and analysis.',
  openrouter: 'Access multiple providers through a single API. Pay-per-token.',
  ollama: 'Run AI models locally. Free, private, no API key needed.'
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
      model: models[0],
      ...(provider === 'ollama' ? { baseUrl: prev.baseUrl || 'http://localhost:11434' } : {})
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
      <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 border border-glass-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{ background: 'rgba(10,10,16,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass-border">
          <div>
            <h2 className="text-lg font-bold text-sf-50">AI Provider Settings</h2>
            <p className="text-xs text-dim mt-1">Configure your preferred AI model and API key</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-3">Provider</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                    config.provider === provider
                      ? 'border-sf-500 bg-sf-500/10 text-sf-50'
                      : 'border-glass-border bg-bg-2 text-dim hover:border-sf-800/50 hover:text-sf-200'
                  }`}
                  style={config.provider === provider ? { boxShadow: '0 2px 12px rgba(107,163,255,0.15)' } : {}}
                >
                  <div className="text-sm font-semibold">{PROVIDER_LABELS[provider]}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-dim mt-2">{PROVIDER_DESCRIPTIONS[config.provider]}</p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Model</label>
            <select
              value={config.model}
              onChange={(e) => { setConfig(prev => ({ ...prev, model: e.target.value })); setSaved(false); }}
              className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
            >
              {PROVIDER_MODELS[config.provider].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* API Key or Base URL */}
          {config.provider === 'ollama' ? (
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Base URL</label>
              <input
                type="text"
                value={config.baseUrl || 'http://localhost:11434'}
                onChange={(e) => { setConfig(prev => ({ ...prev, baseUrl: e.target.value })); setSaved(false); }}
                placeholder="http://localhost:11434"
                className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 font-mono focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-dim mt-1.5">Ollama API endpoint. Default: http://localhost:11434</p>
              <div className="mt-3 bg-bg-2 border border-glass-border rounded-xl p-3">
                <p className="text-xs text-sf-300 font-medium mb-1">Setup:</p>
                <p className="text-xs text-dim font-mono">ollama run huihui-ai/Huihui-Qwen3.5-35B-A3B-abliterated</p>
                <p className="text-xs text-dim mt-2">Ollama enhances prompts locally but uses placeholder images (no image generation).</p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => { setConfig(prev => ({ ...prev, apiKey: e.target.value })); setSaved(false); }}
                  placeholder={`Enter your ${PROVIDER_LABELS[config.provider]} API key`}
                  className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 pr-10 text-sm text-sf-50 font-mono focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-dim hover:text-sf-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-dim">Stored locally in your browser. Never sent to our servers.</p>
                {config.provider === 'gemini' && (
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-sf-400 hover:text-sf-300 transition-colors"
                  >
                    Get key <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Active Status */}
          <div className="bg-bg-2 border border-glass-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dim uppercase tracking-wider">Active Configuration</p>
                <p className="text-sm text-sf-50 font-medium mt-1">
                  {PROVIDER_LABELS[config.provider]} / {config.model}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${config.apiKey || config.provider === 'ollama' ? 'bg-emerald-500 shadow-lg' : 'bg-dim/50'}`}
                style={config.apiKey || config.provider === 'ollama' ? { boxShadow: '0 0 8px rgba(16,185,129,0.4)' } : {}}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-glass-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-dim hover:text-sf-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={saved
              ? { background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 2px 12px rgba(16,185,129,0.25)' }
              : { background: 'linear-gradient(135deg, #4A7FD4, #6BA3FF)', boxShadow: '0 2px 16px rgba(107,163,255,0.25)' }
            }
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
