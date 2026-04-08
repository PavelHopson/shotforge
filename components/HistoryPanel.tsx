import React, { useState } from 'react';
import { X, Clock, Trash2, Image as ImageIcon, ChevronRight, AlertTriangle } from 'lucide-react';
import { GenerationSession } from '../types';
import { getHistory, deleteSession, clearHistory } from '../services/historyService';
import { Button } from './Button';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: GenerationSession) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadSession }) => {
  const [sessions, setSessions] = useState<GenerationSession[]>(() => getHistory());
  const [confirmClear, setConfirmClear] = useState(false);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getHistory());
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearHistory();
      setSessions([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Только что';
    if (mins < 60) return `${mins} мин назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}ч назад`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} onClick={onClose} />

      {/* Drawer */}
      <div
        className="relative w-full max-w-md h-full flex flex-col border-l border-glass-border animate-slide-in-right"
        style={{ background: 'rgba(10,10,16,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-glass-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-sf-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-sf-50">История</h2>
              <p className="text-xs text-dim">{sessions.length} сессий</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  confirmClear
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-dim hover:text-red-400 hover:bg-glass-hover'
                }`}
              >
                {confirmClear ? 'Точно очистить?' : 'Очистить'}
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-dim hover:text-sf-300 hover:bg-glass-hover transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <ImageIcon className="w-12 h-12 text-dim mb-3" />
              <p className="text-dim text-sm">Пока нет генераций</p>
              <p className="text-dim text-xs mt-1">Сгенерируйте фото, и они появятся здесь</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => { onLoadSession(session); onClose(); }}
                className="w-full text-left bg-glass border border-glass-border rounded-xl p-3 hover:border-sf-800/50 transition-all duration-200 group"
              >
                <div className="flex gap-3">
                  {/* Thumbnails */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-bg-3 border border-glass-border shrink-0 grid grid-cols-2 gap-px">
                    {session.photos.slice(0, 4).map((photo, i) => (
                      <div key={i} className="overflow-hidden">
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-sf-100 truncate">{session.presetName}</span>
                      <span className="text-[10px] font-semibold text-sf-400 bg-sf-500/15 px-1.5 py-0.5 rounded-full shrink-0">
                        {session.photos.length} фото
                      </span>
                    </div>
                    <p className="text-xs text-dim">{formatDate(session.timestamp)}</p>
                    <p className="text-[10px] text-dim mt-1 truncate font-mono">
                      {session.photos[0]?.promptUsed?.slice(0, 60)}...
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      className="p-1.5 rounded-lg text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-dim group-hover:text-sf-400 transition-colors" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
