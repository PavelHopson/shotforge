export type CaptureRecorder = 'sharex' | 'focusee';
export type CaptureContentClass = 'public-demo' | 'internal';

export interface CreatorCapturePlanInput {
  recorder: CaptureRecorder;
  contentClass: CaptureContentClass;
  rightsConfirmed: boolean;
  secretsExcluded: boolean;
  clientDataExcluded: boolean;
}

export function createCreatorCapturePlan(input: CreatorCapturePlanInput) {
  if (!input.rightsConfirmed || !input.secretsExcluded || !input.clientDataExcluded) {
    throw new Error('Подтвердите права и отсутствие секретов, клиентских и персональных данных.');
  }
  if (input.recorder === 'focusee' && input.contentClass !== 'public-demo') {
    throw new Error('FocuSee разрешён только для публичного demo.');
  }
  const recorder = input.recorder === 'sharex'
    ? { id: 'sharex', purpose: 'Local screen capture and annotations', mode: 'local-only' }
    : { id: 'focusee', purpose: 'Public demo benchmark only', mode: 'public-demo-benchmark' };
  return {
    schemaVersion: 'eclipse.creator-capture-plan.v1',
    source: 'shotforge',
    createdAt: new Date().toISOString(),
    recorder: input.recorder,
    contentClass: input.contentClass,
    tools: [
      recorder,
      { id: 'quicklook', purpose: 'Local file preview without plugins', mode: 'local-only' },
      { id: 'everything', purpose: 'Allowlisted local folder search', mode: 'local-only' },
    ],
    controls: {
      rightsConfirmed: true,
      secretsExcluded: true,
      clientDataExcluded: true,
      automaticUpload: false,
      pluginsEnabled: false,
      networkServerEnabled: false,
      historyEnabled: false,
      publicationRequiresApproval: true,
    },
  } as const;
}
