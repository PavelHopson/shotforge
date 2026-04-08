import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Preset } from '../types';
import { saveCustomPreset } from '../services/historyService';
import { Button } from './Button';

interface CustomPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (preset: Preset) => void;
}

export const CustomPresetModal: React.FC<CustomPresetModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;

    const preset: Preset = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom preset',
      image: imageUrl.trim() || `https://picsum.photos/400/600?random=${Date.now()}`,
      isPro: false,
      isCustom: true,
      createdAt: Date.now(),
    };

    saveCustomPreset(preset);
    onCreated(preset);
    setName('');
    setDescription('');
    setImageUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={onClose} />

      <div
        className="relative w-full max-w-md mx-4 border border-glass-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{ background: 'rgba(10,10,16,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center">
              <Plus className="w-4.5 h-4.5 text-sf-400" />
            </div>
            <h2 className="text-base font-bold text-sf-50">Новый пресет</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Название *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neon Portrait 2077"
              className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-2 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">Описание стиля</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите стиль, свет, настроение, цвета. Gemini использует это как основу для промптов."
              className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 focus:ring-1 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors resize-none font-mono"
              rows={4}
            />
            <p className="text-xs text-dim mt-1.5">
              <Sparkles className="w-3 h-3 inline mr-1 text-sf-400" />
              Чем детальнее описание — тем точнее результат
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">URL обложки (опционально)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/style-reference.jpg"
              className="w-full bg-bg-2 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-sf-50 font-mono focus:ring-1 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="p-5 border-t border-glass-border flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Создать пресет
          </Button>
        </div>
      </div>
    </div>
  );
};
