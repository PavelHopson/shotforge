import type { ReleaseStoryboard, ReleaseVideoFormat } from '../types';

export interface ReleaseBrief {
  title: string;
  summary: string;
  highlights: string[];
  callToAction: string;
  format: ReleaseVideoFormat;
}

const clean = (value: string, max: number): string => value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

export function createReleaseStoryboard(brief: ReleaseBrief): ReleaseStoryboard {
  const title = clean(brief.title, 90);
  const summary = clean(brief.summary, 220);
  const callToAction = clean(brief.callToAction, 90);
  const highlights = brief.highlights.map((item) => clean(item, 110)).filter(Boolean).slice(0, 3);

  if (!title || !summary || !callToAction || highlights.length === 0) {
    throw new Error('Заполните название, суть релиза, хотя бы одно изменение и призыв к действию.');
  }

  const featureLine = highlights.join(' · ');
  return {
    schemaVersion: 'eclipse.release-storyboard.v1',
    title,
    format: brief.format,
    duration: 15,
    publishRequiresApproval: true,
    scenes: [
      { id: 'signal', start: 0, duration: 3, eyebrow: 'Eclipse Forge / Release', headline: title, body: summary },
      { id: 'problem', start: 3, duration: 3, eyebrow: 'Зачем это нужно', headline: 'Меньше ручной работы. Больше ясности.', body: summary },
      { id: 'changes', start: 6, duration: 3, eyebrow: 'Что изменилось', headline: highlights[0], body: featureLine },
      { id: 'proof', start: 9, duration: 3, eyebrow: 'Проверено', headline: 'Изменение прошло quality gate', body: 'Покажите здесь build, тесты и подтверждённый результат.' },
      { id: 'action', start: 12, duration: 3, eyebrow: 'Следующий шаг', headline: callToAction, body: 'Публикация остаётся ручным подтверждённым действием.' },
    ],
  };
}
