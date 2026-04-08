import React from 'react';
import { GeneratedPhoto } from '../types';
import { Button } from './Button';
import { Download, RefreshCw, Share2, Sparkles } from 'lucide-react';

interface ResultsGalleryProps {
  photos: GeneratedPhoto[];
  onReset: () => void;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ photos, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Complete</span>
          </div>
          <h2 className="text-3xl font-bold text-sf-50 mb-1">Session Complete</h2>
          <p className="text-dim">Your professional portfolio is ready.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Session
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download All (4K)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative bg-glass border border-glass-border rounded-2xl overflow-hidden shadow-2xl animate-slide-up hover:border-sf-800/50 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image Container */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src={photo.url}
                alt="Generated AI Portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <div className="flex gap-2">
                    <button
                      className="p-2.5 rounded-xl text-white transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.5)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2.5 rounded-xl text-white transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.5)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </div>

            {/* Prompt Data */}
            <div className="p-4 bg-bg-2/80 border-t border-glass-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-sf-400" />
                <p className="text-[10px] text-sf-400 font-mono uppercase tracking-wider">Gemini Director Prompt</p>
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
