import React, { useMemo, useState } from 'react';
import { createReleaseStoryboard } from '../services/releaseStoryboardService';
import { createCreatorCapturePlan, type CaptureContentClass, type CaptureRecorder } from '../services/creatorCapturePlanService';
import type { ReleaseVideoFormat } from '../types';
import { VideoAdPipeline } from './VideoAdPipeline';

const formats: ReleaseVideoFormat[] = ['16:9', '9:16', '1:1'];

export const ReleaseStoryboardMode: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [highlights, setHighlights] = useState('');
  const [callToAction, setCallToAction] = useState('Посмотреть релиз');
  const [format, setFormat] = useState<ReleaseVideoFormat>('16:9');
  const [error, setError] = useState<string | null>(null);
  const [captureRecorder, setCaptureRecorder] = useState<CaptureRecorder>('sharex');
  const [contentClass, setContentClass] = useState<CaptureContentClass>('public-demo');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [secretsExcluded, setSecretsExcluded] = useState(false);
  const [clientDataExcluded, setClientDataExcluded] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState<string | null>(null);
  const captureBlocked = !rightsConfirmed || !secretsExcluded || !clientDataExcluded || (captureRecorder === 'focusee' && contentClass !== 'public-demo');

  const storyboard = useMemo(() => {
    try {
      const value = createReleaseStoryboard({
        title,
        summary,
        highlights: highlights.split('\n'),
        callToAction,
        format,
      });
      return value;
    } catch {
      return null;
    }
  }, [title, summary, highlights, callToAction, format]);

  const download = () => {
    try {
      const value = createReleaseStoryboard({ title, summary, highlights: highlights.split('\n'), callToAction, format });
      const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'eclipse-release-storyboard.json';
      anchor.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не удалось собрать раскадровку.');
    }
  };

  const downloadCapturePlan = () => {
    try {
      const value = createCreatorCapturePlan({ recorder: captureRecorder, contentClass, rightsConfirmed, secretsExcluded, clientDataExcluded });
      const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'eclipse-creator-capture-plan.json';
      anchor.click();
      URL.revokeObjectURL(url);
      setCaptureFeedback('Capture plan скачан. Импортируйте его в Eclipse Media для повторной fail-closed проверки.');
    } catch (caught) {
      setCaptureFeedback(caught instanceof Error ? caught.message : 'Не удалось собрать capture plan.');
    }
  };


  return (
    <section className="max-w-6xl mx-auto px-4 py-14" aria-labelledby="storyboard-title">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-sf-400">Shotforge → Eclipse Media</p>
        <h1 id="storyboard-title" className="mt-3 text-3xl md:text-5xl font-bold text-sf-50">Раскадровка релизного видео</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-dim">Опишите релиз простыми словами. Shotforge соберёт безопасный 15-секундный JSON-контракт из пяти сцен для шаблона Eclipse Media.</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5">
        <form className="bg-glass border border-glass-border rounded-2xl p-5 md:p-7 space-y-5" onSubmit={(event) => { event.preventDefault(); download(); }}>
          <label className="block text-sm text-sf-200">Название релиза
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={90} className="mt-2 w-full rounded-xl border border-glass-border bg-bg-3 px-4 py-3 text-sf-50" placeholder="Что стало лучше?" />
          </label>
          <label className="block text-sm text-sf-200">Суть одним абзацем
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={220} rows={4} className="mt-2 w-full rounded-xl border border-glass-border bg-bg-3 px-4 py-3 text-sf-50 resize-y" placeholder="Какую проблему решает релиз?" />
          </label>
          <label className="block text-sm text-sf-200">Главные изменения — по одному в строке
            <textarea value={highlights} onChange={(event) => setHighlights(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-glass-border bg-bg-3 px-4 py-3 text-sf-50 resize-y" placeholder={'Быстрее поиск\nПонятнее фильтры\nУдобнее на телефоне'} />
          </label>
          <label className="block text-sm text-sf-200">Что сделать зрителю
            <input value={callToAction} onChange={(event) => setCallToAction(event.target.value)} maxLength={90} className="mt-2 w-full rounded-xl border border-glass-border bg-bg-3 px-4 py-3 text-sf-50" />
          </label>
          <fieldset>
            <legend className="text-sm text-sf-200 mb-2">Формат</legend>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((item) => <button key={item} type="button" aria-pressed={format === item} onClick={() => setFormat(item)} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${format === item ? 'border-sf-400 bg-sf-500 text-white' : 'border-glass-border bg-bg-3 text-dim'}`}>{item}</button>)}
            </div>
          </fieldset>
          <button type="submit" disabled={!storyboard} className="w-full rounded-xl bg-sf-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Скачать JSON для Eclipse Media</button>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        </form>

        <div className="bg-glass border border-glass-border rounded-2xl p-5 md:p-7">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-sf-50">Предпросмотр структуры</h2><span className="text-xs font-mono text-sf-400">{format} · 15 SEC</span></div>
          {!storyboard ? <div className="mt-8 rounded-xl border border-dashed border-glass-border p-8 text-center text-sm text-dim">Заполните поля слева — пять сцен появятся здесь.</div> : (
            <ol className="mt-6 space-y-3">
              {storyboard.scenes.map((scene) => <li key={scene.id} className="grid grid-cols-[52px_1fr] gap-3 rounded-xl border border-glass-border bg-bg-3 p-4"><span className="text-xs font-mono text-sf-400">{scene.start}–{scene.start + 3}s</span><div><p className="text-[10px] uppercase tracking-widest text-dim">{scene.eyebrow}</p><strong className="mt-1 block text-sf-50">{scene.headline}</strong><p className="mt-1 text-xs leading-5 text-dim">{scene.body}</p></div></li>)}
            </ol>
          )}

      <div className="mt-5 grid lg:grid-cols-[1fr_auto] gap-5 rounded-2xl border border-glass-border bg-glass p-5 md:p-7">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-sf-400">Desktop Creator Kit</p>
          <h2 className="mt-2 text-xl font-bold text-sf-50">Безопасный план записи demo</h2>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-dim">JSON-план не устанавливает приложения и не публикует материалы. Eclipse Media проверяет его fail-closed перед использованием.</p>
          <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm text-sf-200">
            <fieldset className="space-y-2"><legend className="mb-2 font-semibold">Материал</legend>
              <label className="flex gap-2"><input type="radio" checked={contentClass === 'public-demo'} onChange={() => setContentClass('public-demo')} />Публичное demo</label>
              <label className="flex gap-2"><input type="radio" checked={contentClass === 'internal'} onChange={() => setContentClass('internal')} />Внутренний материал</label>
            </fieldset>
            <fieldset className="space-y-2"><legend className="mb-2 font-semibold">Recorder</legend>
              <label className="flex gap-2"><input type="radio" checked={captureRecorder === 'sharex'} onChange={() => setCaptureRecorder('sharex')} />ShareX local-only</label>
              <label className="flex gap-2"><input type="radio" checked={captureRecorder === 'focusee'} onChange={() => setCaptureRecorder('focusee')} />FocuSee public benchmark</label>
            </fieldset>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-sf-200">
            <label className="flex gap-2"><input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} />Есть права на запись и публикацию</label>
            <label className="flex gap-2"><input type="checkbox" checked={secretsExcluded} onChange={(event) => setSecretsExcluded(event.target.checked)} />Секреты и токены исключены</label>
            <label className="flex gap-2"><input type="checkbox" checked={clientDataExcluded} onChange={(event) => setClientDataExcluded(event.target.checked)} />Клиентские и персональные данные исключены</label>
          </div>
        </div>
        <div className="self-end"><button type="button" onClick={downloadCapturePlan} disabled={captureBlocked} className="w-full rounded-xl border border-sf-500 px-5 py-3 font-semibold text-sf-100 hover:bg-sf-500/20 focus:outline-none focus:ring-2 focus:ring-sf-400 disabled:cursor-not-allowed disabled:opacity-40">Скачать capture plan</button>
        <p className="mt-2 max-w-56 text-xs leading-5 text-dim" aria-live="polite">{captureBlocked ? 'Подтвердите права, отсутствие чувствительных данных и допустимый recorder.' : captureFeedback ?? 'План готов к локальному экспорту.'}</p></div>
      </div>
          <p className="mt-5 text-xs leading-5 text-dim">JSON не публикует видео и не содержит API-ключей. После render пользователь отдельно проверяет preview и подтверждает публикацию.</p>
        </div>
      </div>
      <VideoAdPipeline />
    </section>
  );
};
