import React, { useMemo, useState } from 'react';
import { parseReferenceBoard, type ReferenceBoard } from '../services/referenceBoardService';
import { createVideoAdPlan } from '../services/videoAdPlanService';

export const VideoAdPipeline: React.FC = () => {
  const [board, setBoard] = useState<ReferenceBoard | null>(null);
  const [state, setState] = useState<'empty' | 'loading' | 'ready' | 'error' | 'exported'>('empty');
  const [message, setMessage] = useState('Выберите Reference Board JSON из Text2Image.');
  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [proof, setProof] = useState('');
  const [action, setAction] = useState('');
  const [format, setFormat] = useState<'16:9' | '9:16' | '1:1'>('9:16');
  const [previewApproved, setPreviewApproved] = useState(false);

  const plan = useMemo(() => {
    if (!board) return null;
    try { return createVideoAdPlan({ title, hook, proof, action, format, board }); } catch { return null; }
  }, [action, board, format, hook, proof, title]);

  const importBoard = async (file: File | undefined) => {
    if (!file) return;
    setState('loading'); setMessage('Проверяем схему, права и provenance локально…'); setBoard(null); setPreviewApproved(false);
    try {
      if (file.size > 64 * 1024) throw new Error('Reference Board exceeds 64 KB.');
      const parsed = parseReferenceBoard(await file.text());
      setBoard(parsed); setTitle(parsed.board.title); setState('ready');
      setMessage(`${parsed.board.entries.length} референсов проверено. Заполните три сцены.`);
    } catch (caught) {
      setState('error'); setMessage(caught instanceof Error ? caught.message : 'Reference Board validation failed.');
    }
  };

  const download = () => {
    if (!plan || !previewApproved) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'eclipse-video-ad-plan.json'; anchor.click(); URL.revokeObjectURL(url);
    setState('exported'); setMessage('План экспортирован для локального preview в Eclipse Media. Публикация по-прежнему требует отдельного approval.');
  };

  return (
    <section className="mt-8 border-t border-glass-border pt-8" aria-labelledby="video-ad-title">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-sf-400">Reference Board → Video Ad</p>
      <h2 id="video-ad-title" className="mt-2 text-2xl font-bold text-sf-50">Соберите 15-секундный рекламный план</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-dim">Shotforge создаёт только проверяемый JSON-план. Он не запускает render и не публикует видео.</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4 rounded-2xl border border-glass-border bg-glass p-5">
          <label className="block text-sm text-sf-200">Reference Board JSON
            <input type="file" accept="application/json,.json" onChange={(event) => void importBoard(event.target.files?.[0])} className="mt-2 block w-full text-sm text-dim file:mr-3 file:rounded-lg file:border-0 file:bg-sf-500 file:px-4 file:py-2 file:text-white" />
          </label>
          <p role={state === 'error' ? 'alert' : 'status'} aria-live="polite" className={state === 'error' ? 'text-sm text-red-300' : 'text-sm text-dim'}>{message}</p>
          {state === 'loading' && <div className="h-2 overflow-hidden rounded-full bg-bg-3"><div className="h-full w-2/3 animate-pulse bg-sf-500 motion-reduce:animate-none" /></div>}
          <fieldset disabled={!board} className="space-y-3 disabled:opacity-45">
            <label className="block text-sm text-sf-200">Название<input value={title} maxLength={90} onChange={(event) => { setTitle(event.target.value); setPreviewApproved(false); }} className="mt-1 w-full rounded-xl border border-glass-border bg-bg-3 px-3 py-2 text-sf-50" /></label>
            <label className="block text-sm text-sf-200">Hook<input value={hook} maxLength={180} onChange={(event) => { setHook(event.target.value); setPreviewApproved(false); }} className="mt-1 w-full rounded-xl border border-glass-border bg-bg-3 px-3 py-2 text-sf-50" placeholder="Что остановит внимание?" /></label>
            <label className="block text-sm text-sf-200">Proof<input value={proof} maxLength={180} onChange={(event) => { setProof(event.target.value); setPreviewApproved(false); }} className="mt-1 w-full rounded-xl border border-glass-border bg-bg-3 px-3 py-2 text-sf-50" placeholder="Какое утверждение проверено?" /></label>
            <label className="block text-sm text-sf-200">Action<input value={action} maxLength={180} onChange={(event) => { setAction(event.target.value); setPreviewApproved(false); }} className="mt-1 w-full rounded-xl border border-glass-border bg-bg-3 px-3 py-2 text-sf-50" placeholder="Что сделать зрителю?" /></label>
            <label className="block text-sm text-sf-200">Формат<select value={format} onChange={(event) => { setFormat(event.target.value as typeof format); setPreviewApproved(false); }} className="mt-1 w-full rounded-xl border border-glass-border bg-bg-3 px-3 py-2 text-sf-50"><option>9:16</option><option>16:9</option><option>1:1</option></select></label>
          </fieldset>
        </div>
        <div className="rounded-2xl border border-glass-border bg-glass p-5">
          <h3 className="text-lg font-bold text-sf-50">Preview структуры</h3>
          {!plan ? <div className="mt-4 rounded-xl border border-dashed border-glass-border p-8 text-center text-sm text-dim">Импортируйте board и заполните hook, proof и action.</div> : <ol className="mt-4 space-y-3">{plan.plan.scenes.map((scene) => <li key={scene.id} className="grid grid-cols-[48px_1fr] gap-3 rounded-xl border border-glass-border bg-bg-3 p-4"><span className="font-mono text-xs text-sf-400">{scene.start}–{scene.start + 5}s</span><div><strong className="text-sf-50">{scene.purpose}</strong><p className="mt-1 text-sm text-dim">{scene.copy}</p></div></li>)}</ol>}
          <label className="mt-5 flex gap-3 text-sm text-sf-200"><input type="checkbox" disabled={!plan} checked={previewApproved} onChange={(event) => setPreviewApproved(event.target.checked)} /> Я просмотрел все сцены, проверил claims и соответствие референсов</label>
          <button type="button" disabled={!plan || !previewApproved} onClick={download} className="mt-4 w-full rounded-xl bg-sf-500 px-4 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-300 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-3 disabled:cursor-not-allowed disabled:opacity-40">Экспортировать план для Eclipse Media</button>
        </div>
      </div>
    </section>
  );
};
