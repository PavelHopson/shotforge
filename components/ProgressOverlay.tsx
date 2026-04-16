import React from 'react';
import { GenerationProgress } from '../types';
import { Sparkles } from 'lucide-react';

interface ProgressOverlayProps {
  progress: GenerationProgress;
  presetName: string;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ progress, presetName }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="text-center">
        {/* Animated orb */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(107,163,255,0.3) 0%, transparent 70%)' }}
          />
          <div
            className="absolute inset-2 rounded-full animate-glow flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(107,163,255,0.2), rgba(74,127,212,0.1))', border: '1px solid rgba(107,163,255,0.3)' }}
          >
            <Sparkles className="w-8 h-8 text-sf-400" />
          </div>
        </div>

        {/* Status */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-sf-400 uppercase tracking-wider">{presetName}</span>
        </div>
        <h3 className="text-xl font-bold text-sf-50 mb-2">
          {progress.stepLabel}
        </h3>
        <p className="text-sm text-dim mb-8">
          Шаг {progress.currentStep} из {progress.totalSteps}
        </p>

        {/* Progress bar */}
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dim">Прогресс</span>
            <span className="text-xs font-mono text-sf-300">{Math.round(progress.percent)}%</span>
          </div>
          <div className="h-2 bg-bg-3 rounded-full overflow-hidden border border-glass-border">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress.percent}%`,
                background: 'linear-gradient(90deg, #4A7FD4, #6BA3FF, #9DC4FF)',
                boxShadow: '0 0 12px rgba(107,163,255,0.4)',
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: progress.totalSteps }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < progress.currentStep
                    ? 'bg-sf-500'
                    : i === progress.currentStep
                      ? 'bg-sf-400 animate-pulse'
                      : 'bg-bg-3 border border-glass-border'
                }`}
                  style={i < progress.currentStep ? { boxShadow: '0 0 8px rgba(107,163,255,0.4)' } : {}}
                />
                <span className={`text-[10px] ${i <= progress.currentStep ? 'text-sf-300' : 'text-dim'}`}>
                  {i === 0 ? 'Промпты' : `Фото ${i}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
