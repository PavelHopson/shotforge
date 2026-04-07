import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsGallery } from './components/ResultsGallery';
import { SettingsPanel } from './components/SettingsPanel';
import { FaceFusionMode } from './components/FaceFusionMode';
import { AppStep, UserConfig, GeneratedPhoto, FaceAnalysis, AppState, AppMode } from './types';
import { INITIAL_CONFIG } from './constants';
import { generateDirectorPrompts, analyzeImageFeatures, generateImage, analyzeImageStyle } from './services/geminiService';

const App: React.FC = () => {
  // --- Mode & Settings ---
  const [mode, setMode] = useState<AppMode>('photographer');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // --- AI Photographer state (original) ---
  const [step, setStep] = useState<AppStep>('HERO');
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState<AppState>('idle');
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
  const [styleDescription, setStyleDescription] = useState<string>('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    // Reset photographer flow when switching modes
    if (newMode !== 'photographer') {
      setStep('HERO');
    }
  };

  const handleStart = () => {
    setStep('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadComplete = async (base64: string) => {
    setUploadedBase64(base64);
    setAppState('analyzing');
    setErrorMessage(null);

    try {
      const [features, style] = await Promise.all([
        analyzeImageFeatures(base64),
        analyzeImageStyle(base64)
      ]);

      setFaceAnalysis(features);
      setStyleDescription(style);
      setAppState('idle');
      setStep('CONFIG');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Analysis failed:", error);
      setAppState('error');
      setErrorMessage('Failed to analyze image. You can still proceed to configure manually.');
      setStep('CONFIG');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setAppState('generating');
    setErrorMessage(null);

    try {
      const prompts = await generateDirectorPrompts(config);

      const photoPromises = prompts.map(async (prompt, index) => {
        try {
          const url = await generateImage(
            prompt,
            uploadedBase64,
            '3:4',
            '1K'
          );
          return {
            id: `photo-${Date.now()}-${index}`,
            url,
            promptUsed: prompt
          };
        } catch {
          return {
            id: `photo-${Date.now()}-${index}`,
            url: `https://picsum.photos/768/1024?random=${Date.now() + index}`,
            promptUsed: prompt
          };
        }
      });

      const newPhotos = await Promise.all(photoPromises);
      setGeneratedPhotos(newPhotos);
      setAppState('complete');
      setIsLoading(false);
      setStep('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Generation pipeline failed:", error);
      setAppState('error');
      setErrorMessage('Generation failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('HERO');
    setGeneratedPhotos([]);
    setConfig(INITIAL_CONFIG);
    setFaceAnalysis(null);
    setStyleDescription('');
    setUploadedBase64(null);
    setAppState('idle');
    setErrorMessage(null);
  };

  // --- Render mode content ---
  const renderPhotographerMode = () => (
    <>
      {step === 'HERO' && <Hero onStart={handleStart} />}

      {step === 'UPLOAD' && (
        <UploadSection
          onNext={handleUploadComplete}
          faceAnalysis={faceAnalysis}
          appState={appState}
        />
      )}

      {step === 'CONFIG' && (
        <div>
          {errorMessage && (
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-400 text-sm font-medium">Error:</span>
                <span className="text-red-300 text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {styleDescription && (
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-2">Detected Style</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{styleDescription}</p>
              </div>
            </div>
          )}

          {appState === 'generating' && (
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="text-indigo-300 text-sm font-medium">Creating Masterpiece</p>
                  <p className="text-indigo-400/70 text-xs">Generating images with Gemini AI...</p>
                </div>
              </div>
            </div>
          )}

          <ConfigPanel
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>
      )}

      {step === 'RESULTS' && (
        <ResultsGallery photos={generatedPhotos} onReset={handleReset} />
      )}
    </>
  );

  const renderStyleTransferMode = () => (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-indigo-500/10 rounded-full flex items-center justify-center">
          <span className="text-3xl">🎨</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Style Transfer</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-6">
          Upload a reference style image and a target photo. The AI will apply the artistic style of the reference to your target image.
        </p>
        <p className="text-xs text-zinc-600 uppercase tracking-wider font-semibold">Coming Soon</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/30">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <main className="pt-16 pb-20">
        {mode === 'photographer' && renderPhotographerMode()}
        {mode === 'face-fusion' && <FaceFusionMode />}
        {mode === 'style-transfer' && renderStyleTransferMode()}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; 2025 Shotforge AI Inc. Built by Pavel Hopson.
            <br />
            Powered by Gemini 3 Pro, OpenAI & OpenRouter.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default App;
