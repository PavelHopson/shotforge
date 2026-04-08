import React, { useState } from 'react';
import { GeneratedPhoto } from '../types';
import { Button } from './Button';
import { Download, RefreshCw, Share2, Sparkles, Copy, Check, ArrowLeftRight, Grid, Columns } from 'lucide-react';
import { ComparisonView } from './ComparisonView';

interface ResultsGalleryProps {
  photos: GeneratedPhoto[];
  onReset: () => void;
  uploadedImage?: string | null;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ photos, onReset, uploadedImage }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<'grid' | 'columns'>('grid');

  const handleDownload = (photo: GeneratedPhoto, index: number) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `shotforge-${index + 1}-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    photos.forEach((photo, i) => {
      setTimeout(() => handleDownload(photo, i), i * 300);
    });
  };

  const handleCopyPrompt = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async (photo: GeneratedPhoto) => {
    if (navigator.share) {
      try {
        const blob = await fetch(photo.url).then(r => r.blob());
        const file = new File([blob], 'shotforge.jpeg', { type: 'image/jpeg' });
        await navigator.share({ files: [file], title: 'Shotforge AI Photo' });
      } catch {
        // user cancelled or not supported
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Complete</span>
          </div>
          <h2 className="text-3xl font-bold text-sf-50 mb-1">Session Complete</h2>
          <p className="text-dim">{photos.length} professional photos ready.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Layout toggle */}
          <div className="flex bg-bg-3 rounded-xl border border-glass-border p-0.5">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-sf-500 text-white' : 'text-dim hover:text-sf-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('columns')}
              className={`p-2 rounded-lg transition-all ${layout === 'columns' ? 'bg-sf-500 text-white' : 'text-dim hover:text-sf-300'}`}
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Session
          </Button>
          <Button onClick={handleDownloadAll}>
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Comparison View */}
      {compareIndex !== null && uploadedImage && (
        <div className="mb-8 max-w-2xl mx-auto animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-sf-400 uppercase tracking-wider">Сравнение</span>
            <button onClick={() => setCompareIndex(null)} className="text-xs text-dim hover:text-sf-300 transition-colors">
              Закрыть
            </button>
          </div>
          <ComparisonView
            beforeImage={`data:image/jpeg;base64,${uploadedImage}`}
            afterImage={photos[compareIndex].url}
            beforeLabel="Оригинал"
            afterLabel="AI Результат"
          />
        </div>
      )}

      {/* Photos Grid */}
      <div className={`grid gap-6 ${
        layout === 'grid'
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative bg-glass border border-glass-border rounded-2xl overflow-hidden shadow-2xl animate-slide-up hover:border-sf-800/50 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image Container */}
            <div className={`relative overflow-hidden ${layout === 'grid' ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
              <img
                src={photo.url}
                alt={`Generated AI Portrait ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(photo, index)}
                    className="p-2 rounded-xl text-white transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(photo)}
                    className="p-2 rounded-xl text-white transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {uploadedImage && (
                    <button
                      onClick={() => setCompareIndex(compareIndex === index ? null : index)}
                      className={`p-2 rounded-xl text-white transition-all duration-200 hover:scale-110 ${compareIndex === index ? 'ring-2 ring-sf-400' : ''}`}
                      style={{ background: compareIndex === index ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
                      title="Compare"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt Data */}
            <div className="p-3 bg-bg-2/80 border-t border-glass-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sf-400" />
                  <p className="text-[10px] text-sf-400 font-mono uppercase tracking-wider">Prompt #{index + 1}</p>
                </div>
                <button
                  onClick={() => handleCopyPrompt(photo.promptUsed, index)}
                  className="p-1 rounded text-dim hover:text-sf-300 transition-colors"
                  title="Copy prompt"
                >
                  {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-dim line-clamp-2 font-mono leading-relaxed">
                {photo.promptUsed}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
