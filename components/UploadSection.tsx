import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface UploadSectionProps {
  onNext: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <label
          htmlFor="file-upload"
          className={`
            flex flex-col items-center justify-center w-full h-80 
            border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
            ${file 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-500'
            }
          `}
        >
          {file ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-lg font-medium text-white">{file.name}</p>
              <p className="text-sm text-zinc-400 mt-2">Ready to process</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-zinc-400 group-hover:text-zinc-300">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium text-white mb-2">Click to upload or drag & drop</p>
              <p className="text-sm">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          )}
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!file} size="lg" className="w-full sm:w-auto">
          Continue to Studio
        </Button>
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex justify-center gap-6 text-zinc-500 text-xs">
         <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Mediapipe Face Detection</span>
         <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Encrypted Upload</span>
      </div>
    </div>
  );
};