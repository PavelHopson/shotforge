import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { ConfigPanel } from './components/ConfigPanel';
import { PromptEditor } from './components/PromptEditor';
import { ProgressOverlay } from './components/ProgressOverlay';
import { ResultsGallery } from './components/ResultsGallery';
import { SettingsPanel } from './components/SettingsPanel';
import { OnboardingGuide } from './components/OnboardingGuide';
import { HistoryPanel } from './components/HistoryPanel';
import { CustomPresetModal } from './components/CustomPresetModal';
import { FaceFusionMode } from './components/FaceFusionMode';
import { AppStep, UserConfig, GeneratedPhoto, FaceAnalysis, AppState, AppMode, GenerationProgress, GenerationSession, Preset } from './types';
import { INITIAL_CONFIG, PRESETS } from './constants';
import { generateDirectorPrompts, analyzeImageFeatures, generateImage, analyzeImageStyle } from './services/geminiService';
import { saveSession } from './services/historyService';

const App: React.FC = () => {
  // --- Mode & Panels ---
  const [mode, setMode] = useState<AppMode>('photographer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [customPresetOpen, setCustomPresetOpen] = useState(false);

  // --- AI Photographer state ---
  const [step, setStep] = useState<AppStep>('HERO');
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState<AppState>('idle');
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
  const [styleDescription, setStyleDescription] = useState<string>('');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Prompt Editor ---
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);

  // --- Progress ---
  const [progress, setProgress] = useState<GenerationProgress>({
    currentStep: 0, totalSteps: 5, stepLabel: '', percent: 0
  });

  // --- Batch mode ---
  const [batchMode, setBatchMode] = useState(false);
  const [batchPresets, setBatchPresets] = useState<string[]>([]);

  // --- Custom presets ---
  const [customPresetsList, setCustomPresetsList] = useState<Preset[]>([]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
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

  // Step 1: Generate prompts and show editor
  const handleGeneratePrompts = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const prompts = await generateDirectorPrompts(config);
      setGeneratedPrompts(prompts);
      setStep('PROMPTS');
      setAppState('prompts-ready');
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Prompt generation failed:", error);
      setErrorMessage('Failed to generate prompts. Please try again.');
      setIsLoading(false);
    }
  };

  // Step 1 (batch): Generate for multiple presets
  const handleBatchGenerate = async () => {
    if (batchPresets.length === 0) return;

    setIsLoading(true);
    setStep('PROCESSING');
    setErrorMessage(null);

    const allPhotos: GeneratedPhoto[] = [];
    const totalImages = batchPresets.length * config.imageCount;
    const totalSteps = totalImages + batchPresets.length; // prompts + images
    let currentStep = 0;

    try {
      for (const presetId of batchPresets) {
        const batchConfig = { ...config, presetId };
        currentStep++;
        const presetName = [...PRESETS, ...customPresetsList].find(p => p.id === presetId)?.name || presetId;
        setProgress({ currentStep, totalSteps, stepLabel: `Промпты: ${presetName}`, percent: (currentStep / totalSteps) * 100 });

        const prompts = await generateDirectorPrompts(batchConfig);

        for (let i = 0; i < Math.min(prompts.length, config.imageCount); i++) {
          currentStep++;
          setProgress({ currentStep, totalSteps, stepLabel: `${presetName}: фото ${i + 1}`, percent: (currentStep / totalSteps) * 100 });

          try {
            const url = await generateImage(prompts[i], uploadedBase64, '3:4', '1K');
            allPhotos.push({ id: `photo-${Date.now()}-${presetId}-${i}`, url, promptUsed: prompts[i] });
          } catch {
            allPhotos.push({
              id: `photo-${Date.now()}-${presetId}-${i}`,
              url: `https://picsum.photos/768/1024?random=${Date.now() + i}`,
              promptUsed: prompts[i]
            });
          }
        }
      }

      setGeneratedPhotos(allPhotos);
      saveToHistory(allPhotos, `Batch: ${batchPresets.length} presets`);
      setAppState('complete');
      setIsLoading(false);
      setStep('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Batch generation failed:", error);
      setAppState('error');
      setErrorMessage('Batch generation failed. Please try again.');
      setIsLoading(false);
      setStep('CONFIG');
    }
  };

  // Step 2: Regenerate prompts (from editor)
  const handleRegeneratePrompts = async () => {
    setIsLoading(true);
    try {
      const prompts = await generateDirectorPrompts(config);
      setGeneratedPrompts(prompts);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  // Step 3: Confirm prompts and generate images
  const handleConfirmPrompts = async (editedPrompts: string[]) => {
    setStep('PROCESSING');
    setIsLoading(true);
    setAppState('generating');
    setErrorMessage(null);

    const totalSteps = editedPrompts.length + 1;
    setProgress({ currentStep: 0, totalSteps, stepLabel: 'Подготовка...', percent: 0 });

    try {
      const newPhotos: GeneratedPhoto[] = [];

      for (let i = 0; i < editedPrompts.length; i++) {
        setProgress({
          currentStep: i + 1,
          totalSteps,
          stepLabel: `Генерация фото ${i + 1} из ${editedPrompts.length}`,
          percent: ((i + 1) / totalSteps) * 100
        });

        try {
          const url = await generateImage(editedPrompts[i], uploadedBase64, '3:4', '1K');
          newPhotos.push({ id: `photo-${Date.now()}-${i}`, url, promptUsed: editedPrompts[i] });
        } catch {
          newPhotos.push({
            id: `photo-${Date.now()}-${i}`,
            url: `https://picsum.photos/768/1024?random=${Date.now() + i}`,
            promptUsed: editedPrompts[i]
          });
        }
      }

      setGeneratedPhotos(newPhotos);
      const presetName = [...PRESETS, ...customPresetsList].find(p => p.id === config.presetId)?.name || 'Custom';
      saveToHistory(newPhotos, presetName);
      setAppState('complete');
      setIsLoading(false);
      setStep('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Generation failed:", error);
      setAppState('error');
      setErrorMessage('Generation failed. Please try again.');
      setIsLoading(false);
      setStep('CONFIG');
    }
  };

  const saveToHistory = (photos: GeneratedPhoto[], presetName: string) => {
    const session: GenerationSession = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      mode,
      presetName,
      config,
      photos,
      uploadedThumbnail: uploadedBase64 ? uploadedBase64.slice(0, 200) : undefined,
    };
    saveSession(session);
  };

  const handleLoadSession = (session: GenerationSession) => {
    setGeneratedPhotos(session.photos);
    setConfig(session.config);
    setStep('RESULTS');
    setAppState('complete');
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
    setGeneratedPrompts([]);
    setBatchMode(false);
    setBatchPresets([]);
  };

  const handleBatchToggle = (presetId: string) => {
    setBatchPresets(prev =>
      prev.includes(presetId) ? prev.filter(id => id !== presetId) : [...prev, presetId]
    );
  };

  const handleCustomPresetCreated = (preset: Preset) => {
    setCustomPresetsList(prev => [...prev, preset]);
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

          <ConfigPanel
            config={config}
            setConfig={setConfig}
            onGenerate={batchMode ? handleBatchGenerate : handleGeneratePrompts}
            isLoading={isLoading}
            onCreatePreset={() => setCustomPresetOpen(true)}
            batchPresets={batchPresets}
            onBatchToggle={handleBatchToggle}
            batchMode={batchMode}
            onBatchModeToggle={() => setBatchMode(!batchMode)}
          />
        </div>
      )}

      {step === 'PROMPTS' && (
        <PromptEditor
          prompts={generatedPrompts}
          onConfirm={handleConfirmPrompts}
          onRegenerate={handleRegeneratePrompts}
          onBack={() => { setStep('CONFIG'); setAppState('idle'); }}
          isRegenerating={isLoading}
          presetName={[...PRESETS, ...customPresetsList].find(p => p.id === config.presetId)?.name || 'Custom'}
        />
      )}

      {step === 'PROCESSING' && (
        <ProgressOverlay
          progress={progress}
          presetName={[...PRESETS, ...customPresetsList].find(p => p.id === config.presetId)?.name || 'Batch'}
        />
      )}

      {step === 'RESULTS' && (
        <ResultsGallery
          photos={generatedPhotos}
          onReset={handleReset}
          uploadedImage={uploadedBase64}
        />
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
        onHistoryOpen={() => setHistoryOpen(true)}
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

      {/* Modals & Panels */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <OnboardingGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onLoadSession={handleLoadSession} />
      <CustomPresetModal isOpen={customPresetOpen} onClose={() => setCustomPresetOpen(false)} onCreated={handleCustomPresetCreated} />
    </div>
  );
};

export default App;
