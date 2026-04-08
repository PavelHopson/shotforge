import { GenerationSession } from '../types';

const STORAGE_KEY = 'shotforge_history';
const MAX_SESSIONS = 50;

export function getHistory(): GenerationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GenerationSession[];
  } catch {
    return [];
  }
}

export function saveSession(session: GenerationSession): void {
  const history = getHistory();
  history.unshift(session);
  // Keep only the latest sessions
  if (history.length > MAX_SESSIONS) {
    history.length = MAX_SESSIONS;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteSession(id: string): void {
  const history = getHistory().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Custom presets
const PRESETS_KEY = 'shotforge_custom_presets';

export function getCustomPresets(): import('../types').Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPreset(preset: import('../types').Preset): void {
  const presets = getCustomPresets();
  presets.push(preset);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function deleteCustomPreset(id: string): void {
  const presets = getCustomPresets().filter(p => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}
