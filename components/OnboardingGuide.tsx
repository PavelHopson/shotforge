import React, { useState } from 'react';
import { X, Key, Camera, Layers, Sparkles, ExternalLink, ScanFace, Palette, ChevronRight, Star, Zap, Crown } from 'lucide-react';
import { PRESETS } from '../constants';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'api-key' | 'modes' | 'presets';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'api-key', label: 'API Ключ', icon: <Key className="w-3.5 h-3.5" /> },
  { id: 'modes', label: 'Режимы', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'presets', label: 'Пресеты', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const PRESET_TIPS: Record<string, string> = {
  'old-money': 'Лучше всего работает с нейтральной одеждой и мягким светом. Выбирайте Serious или Dreamy эмоцию.',
  'vogue-editorial': 'Используйте Studio освещение и 85mm Portrait. Одежда: минимализм, чёрный/белый.',
  'cyberpunk': 'Включите Neon освещение. Отлично сочетается с тёмной одеждой и Confident эмоцией.',
  'corporate-headshot': 'Идеален для LinkedIn. Studio свет, Warm Smile, деловой костюм.',
  'film-noir': 'Dramatic Rim Light + Serious эмоция. Одежда: тёмные тона, пальто, шляпа.',
  'cinematic-adventure': 'Golden Hour освещение, Full Body Fashion ракурс. Куртка или casual стиль.',
  'manga-anime': 'Любая эмоция подходит. Яркая одежда усиливает эффект. Попробуйте Bold / Confident.',
  'pixel-art': 'Простая одежда без деталей. Все эмоции работают хорошо.',
  'product-photo': 'Studio свет обязателен. Минимум аксессуаров. Чистый фон.',
  '3d-isometric': 'Яркая одежда, любой ракурс. Попробуйте Full Body для лучшего эффекта.',
  'ukiyo-e': 'Традиционная или минималистичная одежда. Dreamy эмоция идеальна.',
  'lego-miniature': 'Яркие цвета одежды! Portrait или Full Body ракурс.',
  'comic-book': 'Bold / Confident эмоция. Яркая одежда. Dramatic свет усиливает контраст.',
  'watercolor-portrait': 'Мягкие пастельные тона одежды. Natural свет. Dreamy или Warm Smile.',
  'hyper-real-selfie': 'Natural свет, минимум макияжа в описании. Macro Beauty Shot ракурс.',
  'macro-skin': 'Macro Beauty Shot обязателен. Natural свет. Минимум одежды в кадре.',
  'interstellar': 'Cinematic Teal/Orange свет. Full Body Fashion. Куртка/комбинезон.',
  'blade-runner': 'Neon освещение + 35mm Editorial. Тёмная кожаная куртка идеальна.',
  'ghibli-anime': 'Natural свет, Warm Smile. Лёгкая, светлая одежда. Мягкий стиль.',
  'pixar-3d': 'Любая яркая одежда. Warm Smile или Bold. Все ракурсы подходят.',
  'indie-film-memory': 'Golden Hour + Dreamy. Casual одежда, vintage стиль.',
};

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('api-key');
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col border border-glass-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{ background: 'rgba(10,10,16,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-glass-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-sf-500 to-sf-400" style={{ boxShadow: '0 2px 12px rgba(124,58,237,0.25)' }}>
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-sf-50">Быстрый старт</h2>
              <p className="text-xs text-dim mt-0.5">Всё, что нужно для начала работы</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 pb-2 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-sf-500 text-white'
                  : 'text-dim hover:text-sf-200 hover:bg-glass-hover'
              }`}
              style={activeTab === tab.id ? { boxShadow: '0 2px 12px rgba(124,58,237,0.3)' } : {}}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ===== API KEY TAB ===== */}
          {activeTab === 'api-key' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-sf-900/30 border border-sf-700/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sf-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Key className="w-4 h-4 text-sf-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sf-100 mb-1">Gemini API — бесплатно</h3>
                    <p className="text-xs text-dim leading-relaxed">
                      Shotforge использует Google Gemini для анализа лица и генерации изображений. API ключ бесплатный с щедрым лимитом.
                    </p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <StepCard
                  number={1}
                  title="Откройте Google AI Studio"
                  description="Перейдите на страницу получения ключа. Войдите с Google аккаунтом."
                  link={{ url: 'https://aistudio.google.com/apikey', label: 'aistudio.google.com/apikey' }}
                />
                <StepCard
                  number={2}
                  title="Создайте API ключ"
                  description='Нажмите "Create API Key" → выберите проект (или создайте новый) → скопируйте ключ.'
                />
                <StepCard
                  number={3}
                  title="Вставьте ключ в Shotforge"
                  description='Нажмите ⚙️ Settings в правом верхнем углу → выберите Gemini → вставьте ключ → Save.'
                />
              </div>

              <div className="bg-glass border border-glass-border rounded-xl p-4">
                <p className="text-xs text-dim leading-relaxed">
                  <span className="text-sf-300 font-semibold">Бесплатный лимит:</span> ~1500 запросов/день для Gemini 2.5 Flash, ~50 запросов/день для генерации изображений (gemini-3-pro-image-preview). Ключ хранится только в вашем браузере.
                </p>
              </div>
            </div>
          )}

          {/* ===== MODES TAB ===== */}
          {activeTab === 'modes' && (
            <div className="space-y-4 animate-fade-in">
              <ModeCard
                icon={<Camera className="w-5 h-5" />}
                title="AI Фотограф"
                badge="Основной режим"
                steps={[
                  'Загрузите селфи — AI проанализирует лицо, тон кожи, волосы',
                  'Выберите один из 21 пресета (Old Money, Cyberpunk, Vogue и др.)',
                  'Настройте параметры: пол, возраст, эмоция, свет, ракурс, одежда',
                  'Нажмите Generate — Gemini создаст 4 варианта фотографий',
                ]}
                tip="Чем чётче селфи (без очков, шапок) — тем точнее результат"
              />
              <ModeCard
                icon={<ScanFace className="w-5 h-5" />}
                title="Face Fusion"
                badge="Композит"
                steps={[
                  'Загрузите своё лицо (обязательно) + минимум 1 ассет',
                  'Ассеты: одежда, обувь, аксессуары, причёска, стиль/сцена',
                  'Нажмите Analyze — AI опишет как объединить всё в один образ',
                  'Отредактируйте промпт (если нужно) → Render Composite',
                ]}
                tip="Загружайте фото реальной одежды/обуви — AI перенесёт их на вас"
              />
              <ModeCard
                icon={<Palette className="w-5 h-5" />}
                title="Style Transfer"
                badge="Скоро"
                steps={[
                  'Загрузите фото-образец стиля (картина, фото, иллюстрация)',
                  'Загрузите целевое фото, на которое нужно перенести стиль',
                  'AI извлечёт стиль и применит его к вашему фото',
                ]}
                tip="Идеально для художественных портретов в стиле известных художников"
                comingSoon
              />
            </div>
          )}

          {/* ===== PRESETS TAB ===== */}
          {activeTab === 'presets' && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-xs text-dim mb-3">Нажмите на пресет для подсказки по настройкам</p>
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setExpandedPreset(expandedPreset === preset.id ? null : preset.id)}
                  className={`w-full text-left rounded-xl border transition-all duration-200 overflow-hidden ${
                    expandedPreset === preset.id
                      ? 'bg-sf-900/30 border-sf-700/40'
                      : 'bg-glass border-glass-border hover:border-sf-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 border ${
                      expandedPreset === preset.id ? 'border-sf-500/50' : 'border-glass-border'
                    }`}>
                      <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-sf-100 truncate">{preset.name}</span>
                        {preset.isPro && (
                          <span className="flex items-center gap-0.5 bg-sf-500/20 text-sf-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            <Crown className="w-2.5 h-2.5" />
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-dim truncate">{preset.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-dim shrink-0 transition-transform duration-200 ${
                      expandedPreset === preset.id ? 'rotate-90 text-sf-400' : ''
                    }`} />
                  </div>
                  {expandedPreset === preset.id && PRESET_TIPS[preset.id] && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-bg-2 rounded-lg p-3 border border-glass-border">
                        <div className="flex items-start gap-2">
                          <Star className="w-3.5 h-3.5 text-sf-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-sf-200 leading-relaxed">{PRESET_TIPS[preset.id]}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const StepCard: React.FC<{
  number: number;
  title: string;
  description: string;
  link?: { url: string; label: string };
}> = ({ number, title, description, link }) => (
  <div className="flex gap-3 items-start">
    <div className="w-7 h-7 rounded-lg bg-sf-500/20 border border-sf-700/30 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-sf-300">{number}</span>
    </div>
    <div className="flex-1 bg-glass border border-glass-border rounded-xl p-3.5">
      <h4 className="text-sm font-semibold text-sf-100 mb-1">{title}</h4>
      <p className="text-xs text-dim leading-relaxed">{description}</p>
      {link && (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-sf-400 hover:text-sf-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {link.label}
        </a>
      )}
    </div>
  </div>
);

const ModeCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  badge: string;
  steps: string[];
  tip: string;
  comingSoon?: boolean;
}> = ({ icon, title, badge, steps, tip, comingSoon }) => (
  <div className={`bg-glass border border-glass-border rounded-xl p-4 ${comingSoon ? 'opacity-60' : ''}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center text-sf-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-sf-100">{title}</h3>
        <span className="text-[10px] font-semibold text-sf-400 uppercase tracking-wider">{badge}</span>
      </div>
      {comingSoon && (
        <span className="ml-auto text-[10px] font-bold text-dim uppercase tracking-wider bg-bg-3 px-2 py-1 rounded-full">Soon</span>
      )}
    </div>
    <ol className="space-y-1.5 mb-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-2 text-xs text-dim leading-relaxed">
          <span className="text-sf-400 font-mono shrink-0">{i + 1}.</span>
          {s}
        </li>
      ))}
    </ol>
    <div className="flex items-start gap-2 bg-sf-900/20 border border-sf-800/30 rounded-lg p-2.5">
      <Sparkles className="w-3 h-3 text-sf-400 shrink-0 mt-0.5" />
      <p className="text-[11px] text-sf-300 leading-relaxed">{tip}</p>
    </div>
  </div>
);
