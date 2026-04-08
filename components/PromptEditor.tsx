import React, { useState } from 'react';
import { Wand2, Pencil, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface PromptEditorProps {
  prompts: string[];
  onConfirm: (editedPrompts: string[]) => void;
  onRegenerate: () => void;
  onBack: () => void;
  isRegenerating: boolean;
  presetName: string;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompts, onConfirm, onRegenerate, onBack, isRegenerating, presetName
}) => {
  const [editedPrompts, setEditedPrompts] = useState<string[]>(prompts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handlePromptChange = (index: number, value: string) => {
    setEditedPrompts(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const resetPrompt = (index: number) => {
    setEditedPrompts(prev => {
      const next = [...prev];
      next[index] = prompts[index];
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sf-900/30 border border-sf-700/30 mb-4">
          <Sparkles className="w-3 h-3 text-sf-400" />
          <span className="text-xs font-semibold text-sf-300">{presetName}</span>
        </div>
        <h2 className="text-2xl font-bold text-sf-50 mb-2">AI Director Prompts</h2>
        <p className="text-dim text-sm max-w-xl mx-auto">
          Gemini создал {editedPrompts.length} промптов для вашей сессии. Отредактируйте или подтвердите для генерации.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {editedPrompts.map((prompt, i) => {
          const isEditing = editingIndex === i;
          const isModified = prompt !== prompts[i];

          return (
            <div
              key={i}
              className={`bg-glass border rounded-xl p-4 transition-all duration-200 ${
                isEditing ? 'border-sf-500/50 ring-1 ring-sf-500/20' : 'border-glass-border hover:border-sf-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sf-900/40 border border-sf-800/40 flex items-center justify-center text-xs font-bold text-sf-400">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-dim uppercase tracking-wider">Вариант {i + 1}</span>
                  {isModified && (
                    <span className="text-[10px] font-bold text-sf-400 bg-sf-500/15 px-1.5 py-0.5 rounded-full">edited</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {isModified && (
                    <button
                      onClick={() => resetPrompt(i)}
                      className="p-1.5 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors"
                      title="Сбросить"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingIndex(isEditing ? null : i)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isEditing ? 'text-sf-400 bg-sf-500/15' : 'text-dim hover:text-sf-300 hover:bg-glass-hover'
                    }`}
                    title="Редактировать"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={prompt}
                  onChange={(e) => handlePromptChange(i, e.target.value)}
                  className="w-full bg-bg-2 border border-glass-border rounded-lg p-3 text-sf-200 text-xs font-mono leading-relaxed resize-none focus:ring-1 focus:ring-sf-500 focus:border-sf-500 focus:outline-none transition-colors"
                  rows={4}
                  autoFocus
                />
              ) : (
                <p className="text-xs text-dim font-mono leading-relaxed line-clamp-3 cursor-pointer" onClick={() => setEditingIndex(i)}>
                  {prompt}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onBack} size="sm">
            Назад к настройкам
          </Button>
          <Button
            variant="secondary"
            onClick={onRegenerate}
            disabled={isRegenerating}
            size="sm"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Новые промпты
          </Button>
        </div>
        <Button
          onClick={() => onConfirm(editedPrompts)}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Генерировать {editedPrompts.length} фото
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
