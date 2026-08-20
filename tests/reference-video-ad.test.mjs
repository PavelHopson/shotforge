import assert from 'node:assert/strict';
import test from 'node:test';
import { parseReferenceBoard } from '../services/referenceBoardService.ts';
import { createVideoAdPlan } from '../services/videoAdPlanService.ts';

const board = { schemaVersion: 'eclipse.reference-board.v1', board: { id: 'rb-1', title: 'Product', createdAt: '2026-08-20T00:00:00.000Z', approvalRequired: true, entries: [{ id: 'ref-1', kind: 'object', localFileName: 'product.png', description: 'Owned product image', rightsStatus: 'owned', consentConfirmed: false, provenance: { origin: 'ai-generated', provider: 'local', model: 'demo', createdAt: '2026-08-20T00:00:00.000Z' } }] } };
test('validates board and builds preview-only ad plan', () => {
  const parsed = parseReferenceBoard(JSON.stringify(board));
  const plan = createVideoAdPlan({ title: 'Launch', hook: 'See the change', proof: 'Reviewed result', action: 'Open the demo', format: '9:16', board: parsed });
  assert.equal(plan.plan.publishRequiresApproval, true);
  assert.equal(plan.plan.claimsRequireReview, true);
  assert.equal(plan.plan.scenes.length, 3);
  assert.equal(plan.plan.id, 'ad-rb-1-9x16');
});
test('rejects paths, unconfirmed rights, and missing likeness consent', () => {
  const pathBoard = structuredClone(board); pathBoard.board.entries[0].localFileName = '../product.png';
  assert.throws(() => parseReferenceBoard(JSON.stringify(pathBoard)), /local image filename/i);
  const rightsBoard = structuredClone(board); rightsBoard.board.entries[0].rightsStatus = 'unconfirmed';
  assert.throws(() => parseReferenceBoard(JSON.stringify(rightsBoard)), /rights/i);
  const personBoard = structuredClone(board); personBoard.board.entries[0].kind = 'character';
  assert.throws(() => parseReferenceBoard(JSON.stringify(personBoard)), /consent/i);
  const originBoard = structuredClone(board); originBoard.board.entries[0].provenance.origin = 'unknown';
  assert.throws(() => parseReferenceBoard(JSON.stringify(originBoard)), /provenance/i);
  const consentBoard = structuredClone(board); consentBoard.board.entries[0].consentConfirmed = 'false';
  assert.throws(() => parseReferenceBoard(JSON.stringify(consentBoard)), /boolean/i);
});
