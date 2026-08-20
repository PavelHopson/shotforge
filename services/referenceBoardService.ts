export type ReferenceKind = 'shot' | 'object' | 'location' | 'pose' | 'character' | 'creature';
export type ReferenceEntry = { id: string; kind: ReferenceKind; localFileName: string; description: string; rightsStatus: 'owned' | 'licensed' | 'public-domain' | 'consented'; consentConfirmed: boolean; provenance: { origin: 'ai-generated' | 'camera' | 'licensed-library' | 'user-supplied'; provider: string; model: string; createdAt: string } };
export type ReferenceBoard = { schemaVersion: 'eclipse.reference-board.v1'; board: { id: string; title: string; createdAt: string; approvalRequired: true; entries: ReferenceEntry[] } };

const KINDS = new Set(['shot', 'object', 'location', 'pose', 'character', 'creature']);
const RIGHTS = new Set(['owned', 'licensed', 'public-domain', 'consented']);
const ORIGINS = new Set(['ai-generated', 'camera', 'licensed-library', 'user-supplied']);
const clean = (value: unknown, max: number) => {
  if (typeof value !== 'string') throw new Error('Reference Board contains a non-text field.');
  const result = value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!result || result.length > max) throw new Error('Reference Board text is empty or exceeds its limit.');
  return result;
};
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).sort().join('|') === [...keys].sort().join('|');

export function parseReferenceBoard(raw: string): ReferenceBoard {
  if (new TextEncoder().encode(raw).byteLength > 64 * 1024) throw new Error('Reference Board exceeds 64 KB.');
  let value: unknown; try { value = JSON.parse(raw); } catch { throw new Error('Reference Board JSON is invalid.'); }
  if (!record(value) || !exact(value, ['schemaVersion', 'board']) || value.schemaVersion !== 'eclipse.reference-board.v1' || !record(value.board)) throw new Error('Expected strict eclipse.reference-board.v1.');
  const board = value.board;
  if (!exact(board, ['id', 'title', 'createdAt', 'approvalRequired', 'entries']) || board.approvalRequired !== true || !Array.isArray(board.entries) || board.entries.length < 1 || board.entries.length > 24) throw new Error('Reference Board structure is incomplete.');
  if (!Number.isFinite(Date.parse(String(board.createdAt)))) throw new Error('Reference Board createdAt is invalid.');
  const entries = board.entries.map((item): ReferenceEntry => {
    if (!record(item) || !exact(item, ['id', 'kind', 'localFileName', 'description', 'rightsStatus', 'consentConfirmed', 'provenance']) || !record(item.provenance)) throw new Error('Reference entry has unknown fields.');
    if (!KINDS.has(String(item.kind)) || !RIGHTS.has(String(item.rightsStatus))) throw new Error('Reference type or rights status is unsupported.');
    if (typeof item.consentConfirmed !== 'boolean') throw new Error('Reference consent flag must be boolean.');
    if ((item.kind === 'pose' || item.kind === 'character') && item.consentConfirmed !== true) throw new Error('Likeness consent is required.');
    const localFileName = clean(item.localFileName, 180);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpg|jpeg|webp)$/i.test(localFileName)) throw new Error('Reference must use a local image filename without a path.');
    if (!exact(item.provenance, ['origin', 'provider', 'model', 'createdAt']) || !ORIGINS.has(String(item.provenance.origin)) || !Number.isFinite(Date.parse(String(item.provenance.createdAt)))) throw new Error('Reference provenance is invalid.');
    return { id: clean(item.id, 80), kind: item.kind as ReferenceKind, localFileName, description: clean(item.description, 500), rightsStatus: item.rightsStatus as ReferenceEntry['rightsStatus'], consentConfirmed: item.consentConfirmed === true, provenance: { origin: item.provenance.origin as ReferenceEntry['provenance']['origin'], provider: clean(item.provenance.provider, 80), model: clean(item.provenance.model, 160), createdAt: String(item.provenance.createdAt) } };
  });
  return { schemaVersion: 'eclipse.reference-board.v1', board: { id: clean(board.id, 80), title: clean(board.title, 90), createdAt: String(board.createdAt), approvalRequired: true, entries } };
}
