import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { FaceAnalysis, AppState } from '../types';

interface UploadSectionProps {
  onNext: (base64: string) => void;
  faceAnalysis: FaceAnalysis | null;
  appState: AppState;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onNext, faceAnalysis, appState }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleContinue = () => {
    if (preview) {
      // Pass the base64 data (strip prefix for API calls)
      const base64Data = preview.split(',')[1];
      onNext(base64Data);
    }
  };

  const isAnalyzing = appState === 'analyzing';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">Upload a Reference Selfie</h2>
        <p className="text-zinc-400">
          We need one clear photo of your face. No sunglasses, no hats.
          <br />Your data is processed ephemerally and deleted in 24h.
        </p>
      </div>

      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            flex flex-col items-center justify-center w-full h-80
            border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
            ${isDragging
              ? 'border-indigo-400 bg-indigo-500/20 scale-[1.02]'
              : preview
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-500'
            }
          `}
        >
          {preview ? (
            <div className="w-full h-full relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-medium flex items-center gap-2">
                  <UploadCloud className="w-5 h-5" />
                  Change Photo
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-400 group-hover:text-zinc-300">
              <div className={`w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6 transition-transform ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
                <UploadCloud className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium text-white mb-2">Click to upload or drag & drop</p>
              <p className="text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* Face Analysis Results */}
      {faceAnalysis && faceAnalysis.faceShape !== 'Unknown' && (
        <div className="mt-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl animate-in fade-in duration-500">
          <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-3">AI Face Analysis</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {faceAnalysis.faceShape && (
              <div><span className="text-zinc-500">Face Shape:</span> <span className="text-white">{faceAnalysis.faceShape}</span></div>
            )}
            {faceAnalysis.skinTone && (
              <div><span className="text-zinc-500">Skin Tone:</span> <span className="text-white">{faceAnalysis.skinTone}</span></div>
            )}
            {faceAnalysis.hairColor && (
              <div><span className="text-zinc-500">Hair:</span> <span className="text-white">{faceAnalysis.hairColor}</span></div>
            )}
            {faceAnalysis.bodyType && (
              <div><span className="text-zinc-500">Build:</span> <span className="text-white">{faceAnalysis.bodyType}</span></div>
            )}
          </div>
          {faceAnalysis.styleKeywords && faceAnalysis.styleKeywords.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {faceAnalysis.styleKeywords.map((kw, i) => (
                <span key={i} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="mt-6 flex items-center justify-center gap-3 text-indigo-400 animate-pulse">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Analyzing facial features...</span>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} disabled={!file || isAnalyzing} size="lg" className="w-full sm:w-auto">
          {isAnalyzing ? 'Analyzing...' : 'Continue to Studio'}
        </Button>
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex justify-center gap-6 text-zinc-500 text-xs">
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> AI Face Analysis</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Encrypted Upload</span>
      </div>
    </div>
  );
};
