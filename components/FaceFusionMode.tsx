import React, { useState, useRef, useCallback, useMemo } from 'react';
import { UploadCloud, X, Download, Wand2, ScanFace, Shirt, Footprints, Gem, Scissors, Palette } from 'lucide-react';
import { Button } from './Button';
import { FusionAssetMap, FusionAssetType, FusionImageFile, AspectRatio } from '../types';
import { analyzeFusionAssets, generateFusionImage } from '../services/geminiService';

const ASSET_CONFIG: { type: FusionAssetType; label: string; icon: React.ReactNode; highlight?: boolean }[] = [
  { type: 'face', label: 'Face / Identity', icon: <ScanFace className="w-5 h-5" />, highlight: true },
  { type: 'style', label: 'Style / Scene', icon: <Palette className="w-5 h-5" /> },
  { type: 'clothing', label: 'Clothing', icon: <Shirt className="w-5 h-5" /> },
  { type: 'shoes', label: 'Shoes', icon: <Footprints className="w-5 h-5" /> },
  { type: 'accessories', label: 'Accessories', icon: <Gem className="w-5 h-5" /> },
  { type: 'hairstyle', label: 'Hairstyle', icon: <Scissors className="w-5 h-5" /> },
];

interface AssetSlotProps {
  config: typeof ASSET_CONFIG[0];
  image: FusionImageFile | undefined;
  onUpload: (type: FusionAssetType, img: FusionImageFile) => void;
  onRemove: (type: FusionAssetType) => void;
}

const AssetSlot: React.FC<AssetSlotProps> = ({ config, image, onUpload, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setPreview(result);
      onUpload(config.type, { data: base64Data, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }, [config.type, onUpload]);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onRemove(config.type);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`
        relative group flex flex-col items-center justify-center rounded-xl border-2 border-dashed
        cursor-pointer transition-all duration-200 overflow-hidden min-h-[140px]
        ${config.highlight ? 'border-indigo-500/50 bg-indigo-500/5 hover:border-indigo-400' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}
        ${preview ? 'border-solid' : ''}
      `}
    >
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview ? (
        <>
          <img src={preview} alt={config.label} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
            <span className="text-white text-xs font-medium">Change</span>
            <button
              onClick={handleRemoveClick}
              className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 z-10">
            <span className="text-[10px] text-white font-semibold uppercase tracking-wider">{config.label}</span>
          </div>
        </>
      ) : (
        <div className="text-center p-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <div className="mx-auto mb-2">{config.icon}</div>
          <p className="text-xs font-semibold uppercase tracking-wider">{config.label}</p>
          <p className="text-[10px] mt-1 text-zinc-600">Click to upload</p>
        </div>
      )}
    </div>
  );
};

export const FaceFusionMode: React.FC = () => {
  const [assets, setAssets] = useState<FusionAssetMap>({});
  const [extractedPrompt, setExtractedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Upload a face + at least one asset to begin.');
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');

  const handleAssetUpload = useCallback((type: FusionAssetType, img: FusionImageFile) => {
    setAssets(prev => ({ ...prev, [type]: img }));
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleAssetRemove = useCallback((type: FusionAssetType) => {
    setAssets(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
    setError(null);
  }, []);

  const canAnalyze = useMemo(() => {
    const hasFace = !!assets.face;
    const hasOtherAsset = Object.keys(assets).some(k => k !== 'face' && assets[k as FusionAssetType]);
    return hasFace && hasOtherAsset && !isProcessing;
  }, [assets, isProcessing]);

  const canGenerate = useMemo(() => {
    return !!assets.face && !!extractedPrompt && !isProcessing;
  }, [assets.face, extractedPrompt, isProcessing]);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setIsProcessing(true);
    setStatus('Analyzing assets...');
    setError(null);

    try {
      const prompt = await analyzeFusionAssets(assets);
      setExtractedPrompt(prompt);
      setStatus('Analysis complete. Edit the prompt if needed, then render.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Analysis failed: ${msg}`);
      setStatus('Error during analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsProcessing(true);
    setGeneratedImage(null);
    setStatus('Rendering composite image...');
    setError(null);

    try {
      const result = await generateFusionImage(assets, extractedPrompt, aspectRatio);
      setGeneratedImage(result);
      setStatus('Render complete!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Render failed: ${msg}`);
      setStatus('Error during rendering.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `face-fusion-${aspectRatio}-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Face Fusion Studio</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Upload your face and reference assets (clothing, style, accessories). Our AI will analyze them and composite a photorealistic result.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT: Inputs */}
        <div className="xl:col-span-2 space-y-6">
          {/* Face (primary) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Step 1: Identity</p>
            <AssetSlot
              config={ASSET_CONFIG[0]}
              image={assets.face}
              onUpload={handleAssetUpload}
              onRemove={handleAssetRemove}
            />
          </div>

          {/* Other Assets */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Step 2: Scene & Assets</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ASSET_CONFIG.slice(1).map((cfg) => (
                <AssetSlot
                  key={cfg.type}
                  config={cfg}
                  image={assets[cfg.type]}
                  onUpload={handleAssetUpload}
                  onRemove={handleAssetRemove}
                />
              ))}
            </div>
          </div>

          {/* Status + Analyze Button */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Status</p>
              <p className={`text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-300'}`}>
                {error || status}
              </p>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Analyze Assets
            </Button>
          </div>

          {/* Prompt Editor */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 block">
              Composite Prompt (editable)
            </label>
            <textarea
              value={extractedPrompt}
              onChange={(e) => setExtractedPrompt(e.target.value)}
              placeholder="Prompt will appear here after analysis..."
              className="w-full h-32 bg-zinc-950 rounded-lg p-3 text-zinc-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none border border-zinc-700 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Step 3: Render</p>

            {/* Aspect Ratio */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                disabled={isProcessing}
              >
                <option value="9:16">9:16 - Portrait (Stories)</option>
                <option value="1:1">1:1 - Square</option>
                <option value="16:9">16:9 - Landscape</option>
                <option value="3:4">3:4 - Classic</option>
                <option value="4:3">4:3 - Wide</option>
              </select>
            </div>

            {/* Result area */}
            <div className="flex-grow flex items-center justify-center bg-zinc-950/50 rounded-xl border-2 border-dashed border-zinc-800 p-4 min-h-[400px] relative overflow-hidden">
              {isProcessing && !generatedImage ? (
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-indigo-400 text-sm font-medium">{status}</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full group flex items-center justify-center">
                  <img src={generatedImage} alt="Face fusion result" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                  <button
                    onClick={handleDownload}
                    className="absolute top-2 right-2 bg-zinc-900/90 p-2.5 rounded-full text-white hover:bg-indigo-500 transition-all shadow-xl"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center opacity-50">
                  <Wand2 className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Your composite image will appear here after rendering.
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 font-bold"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Render Composite
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
