import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsGallery } from './components/ResultsGallery';
import { AppStep, UserConfig, GeneratedPhoto, FaceAnalysis, AppState } from './types';
import { INITIAL_CONFIG } from './constants';
import { generateDirectorPrompts, analyzeImageFeatures, generateImage, analyzeImageStyle } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('HERO');
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState<AppState>('idle');
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
  const [styleDescription, setStyleDescription] = useState<string>('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = () => {
    setStep('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadComplete = async (base64: string) => {
    setUploadedBase64(base64);
    setAppState('analyzing');
    setErrorMessage(null);

    try {
      // Run face analysis and style analysis in parallel
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
      // Still allow proceeding
      setStep('CONFIG');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setAppState('generating');
    setErrorMessage(null);

    try {
      // 1. Get prompts from Gemini Director
      const prompts = await generateDirectorPrompts(config);

      // 2. Try real Gemini image generation for each prompt
      const photoPromises = prompts.map(async (prompt, index) => {
        try {
          const url = await generateImage(
            prompt,
            uploadedBase64,
            '3:4', // Portrait aspect ratio
            '1K'
          );
          return {
            id: `photo-${Date.now()}-${index}`,
            url,
            promptUsed: prompt
          };
        } catch {
          // Fallback to picsum if real generation fails
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

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/30">
      <Header />

      <main className="pt-16 pb-20">
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
            {/* Error banner */}
            {errorMessage && (
              <div className="max-w-4xl mx-auto px-4 mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-red-400 text-sm font-medium">Error:</span>
                  <span className="text-red-300 text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Style description from analysis */}
            {styleDescription && (
              <div className="max-w-4xl mx-auto px-4 mb-4">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-2">Detected Style</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{styleDescription}</p>
                </div>
              </div>
            )}

            {/* Generation state indicator */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; 2025 Shotforge AI Inc. Built by Pavel Hopson.
            <br />
            Powered by Gemini 3 Pro & Flux.1 Pro.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
