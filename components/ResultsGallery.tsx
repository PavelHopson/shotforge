import React from 'react';
import { GeneratedPhoto } from '../types';
import { Button } from './Button';
import { Download, RefreshCw, Share2 } from 'lucide-react';

interface ResultsGalleryProps {
  photos: GeneratedPhoto[];
  onReset: () => void;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ photos, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
          <p className="text-zinc-400">Your professional portfolio is ready.</p>
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
        {photos.map((photo) => (
          <div key={photo.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Image Container */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src={photo.url} 
                alt="Generated AI Portrait" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <div className="flex gap-2">
                    <button className="bg-white/10 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="bg-white/10 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/20 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </div>
            
            {/* Prompt Data (Debug/Pro View) */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              <p className="text-[10px] text-indigo-400 font-mono mb-1 uppercase tracking-wider">Gemini Director Prompt</p>
              <p className="text-xs text-zinc-500 line-clamp-2 font-mono leading-relaxed">
                {photo.promptUsed}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};