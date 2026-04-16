import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Shield, Scan } from 'lucide-react';
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
      const base64Data = preview.split(',')[1];
      onNext(base64Data);
    }
  };

  const isAnalyzing = appState === 'analyzing';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-sf-50 mb-4">Upload a Reference Selfie</h2>
        <p className="text-dim">
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
              ? 'border-sf-400 scale-[1.02]'
              : preview
                ? 'border-sf-500 border-solid'
                : 'border-glass-border bg-glass hover:border-sf-700/50'
            }
          `}
          style={isDragging
            ? { background: 'rgba(107,163,255,0.1)', boxShadow: '0 0 40px rgba(107,163,255,0.15)' }
            : preview
              ? { background: 'rgba(107,163,255,0.05)' }
              : {}
          }
        >
          {preview ? (
            <div className="w-full h-full relative">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-medium flex items-center gap-2">
                  <UploadCloud className="w-5 h-5" />
                  Change Photo
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-dim group-hover:text-sf-300 transition-colors">
              <div className={`w-20 h-20 rounded-2xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center mb-6 transition-transform ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
                <UploadCloud className="w-10 h-10 text-sf-400" />
              </div>
              <p className="text-lg font-medium text-sf-100 mb-2">Click to upload or drag & drop</p>
              <p className="text-sm text-dim">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* Face Analysis Results */}
      {faceAnalysis && faceAnalysis.faceShape !== 'Unknown' && (
        <div className="mt-6 bg-glass border border-glass-border rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Scan className="w-3.5 h-3.5 text-sf-400" />
            <p className="text-xs text-sf-400 font-mono uppercase tracking-wider">AI Face Analysis</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {faceAnalysis.faceShape && (
              <div><span className="text-dim">Face Shape:</span> <span className="text-sf-100">{faceAnalysis.faceShape}</span></div>
            )}
            {faceAnalysis.skinTone && (
              <div><span className="text-dim">Skin Tone:</span> <span className="text-sf-100">{faceAnalysis.skinTone}</span></div>
            )}
            {faceAnalysis.hairColor && (
              <div><span className="text-dim">Hair:</span> <span className="text-sf-100">{faceAnalysis.hairColor}</span></div>
            )}
            {faceAnalysis.bodyType && (
              <div><span className="text-dim">Build:</span> <span className="text-sf-100">{faceAnalysis.bodyType}</span></div>
            )}
          </div>
          {faceAnalysis.styleKeywords && faceAnalysis.styleKeywords.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {faceAnalysis.styleKeywords.map((kw, i) => (
                <span key={i} className="text-xs bg-sf-500/15 text-sf-300 px-2.5 py-1 rounded-full border border-sf-700/30">{kw}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sf-400 animate-pulse">
          <div className="w-4 h-4 border-2 border-sf-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Analyzing facial features...</span>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} disabled={!file || isAnalyzing} size="lg" className="w-full sm:w-auto">
          {isAnalyzing ? 'Analyzing...' : 'Continue to Studio'}
        </Button>
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex justify-center gap-6 text-dim text-xs">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sf-400" /> AI Face Analysis</span>
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-sf-400" /> Encrypted Upload</span>
      </div>
    </div>
  );
};
