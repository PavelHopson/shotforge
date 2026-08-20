import type { ReferenceBoard } from './referenceBoardService';

export type VideoAdPlan = { schemaVersion: 'eclipse.video-ad-plan.v1'; plan: { id: string; title: string; format: '16:9' | '9:16' | '1:1'; duration: 15; referenceBoardId: string; claimsRequireReview: true; publishRequiresApproval: true; scenes: Array<{ id: string; start: number; duration: 5; purpose: 'hook' | 'proof' | 'action'; copy: string; referenceIds: string[] }> } };
const clean = (value: string, max: number) => value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max).trim();

export function createVideoAdPlan(input: { title: string; hook: string; proof: string; action: string; format: '16:9' | '9:16' | '1:1'; board: ReferenceBoard }): VideoAdPlan {
  const copy = [input.hook, input.proof, input.action].map((value) => clean(value, 180));
  if (!clean(input.title, 90) || copy.some((value) => !value)) throw new Error('Title, hook, proof, and action are required.');
  const referenceIds = input.board.board.entries.map((entry) => entry.id);
  return { schemaVersion: 'eclipse.video-ad-plan.v1', plan: { id: `ad-${input.board.board.id}-${input.format.replace(':', 'x')}`, title: clean(input.title, 90), format: input.format, duration: 15, referenceBoardId: input.board.board.id, claimsRequireReview: true, publishRequiresApproval: true, scenes: ['hook', 'proof', 'action'].map((purpose, index) => ({ id: purpose, start: index * 5, duration: 5, purpose: purpose as 'hook' | 'proof' | 'action', copy: copy[index], referenceIds })) } };
}
