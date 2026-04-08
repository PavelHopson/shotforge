import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsGallery } from './components/ResultsGallery';
import { SettingsPanel } from './components/SettingsPanel';
import { OnboardingGuide } from './components/OnboardingGuide';
import { FaceFusionMode } from './components/FaceFusionMode';
import { AppStep, UserConfig, GeneratedPhoto, FaceAnalysis, AppState, AppMode } from './types';
import { INITIAL_CONFIG } from './constants';
import { generateDirectorPrompts, analyzeImageFeatures, generateImage, analyzeImageStyle } from './services/geminiService';

const App: React.FC = () => {
  // --- Mode & Settings ---
  const [mode, setMode] = useState<AppMode>('photographer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

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
              <div className="bg-glass border border-glass-border rounded-xl p-4">
                <p className="text-xs text-sf-400 font-mono uppercase tracking-wider mb-2">Detected Style</p>
                <p className="text-sm text-sf-200 leading-relaxed">{styleDescription}</p>
              </div>
            </div>
          )}

          {appState === 'generating' && (
            <div className="max-w-4xl mx-auto px-4 mb-4">
              <div className="bg-sf-500/10 border border-sf-500/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-sf-400 border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="text-sf-200 text-sm font-medium">Creating Masterpiece</p>
                  <p className="text-sf-400/70 text-xs">Generating images with Gemini AI...</p>
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
      <div className="bg-glass border border-glass-border rounded-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
        <div className="w-16 h-16 mx-auto mb-6 bg-sf-900/40 border border-sf-800/40 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">🎨</span>
        </div>
        <h2 className="text-2xl font-bold text-sf-50 mb-3">Style Transfer</h2>
        <p className="text-dim max-w-md mx-auto mb-6">
          Upload a reference style image and a target photo. The AI will apply the artistic style of the reference to your target image.
        </p>
        <span className="inline-flex items-center gap-1.5 bg-sf-900/30 border border-sf-700/30 px-3 py-1.5 rounded-full text-xs font-semibold text-sf-300 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-sf-400 animate-pulse"></span>
          Coming Soon
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-sf-500/30">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onSettingsOpen={() => setSettingsOpen(true)}
        onGuideOpen={() => setGuideOpen(true)}
      />

      <main className="pt-16 pb-20">
        {mode === 'photographer' && renderPhotographerMode()}
        {mode === 'face-fusion' && <FaceFusionMode />}
        {mode === 'style-transfer' && renderStyleTransferMode()}
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border py-12" style={{ background: 'rgba(5,5,7,0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-dim text-sm">
            &copy; 2025 Shotforge AI Inc. Built by Pavel Hopson.
            <br />
            Powered by Gemini 3 Pro, OpenAI & OpenRouter.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <OnboardingGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};

export default App;
