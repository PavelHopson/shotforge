import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsGallery } from './components/ResultsGallery';
import { AppStep, UserConfig, GeneratedPhoto } from './types';
import { INITIAL_CONFIG } from './constants';
import { generateDirectorPrompts } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('HERO');
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setStep('UPLOAD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadComplete = () => {
    setStep('CONFIG');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    // 1. Get Prompts from Gemini
    const prompts = await generateDirectorPrompts(config);
    
    // 2. Simulate Image Generation (In production, this calls Replicate/Flux API)
    // We add a delay to simulate the GPU processing time
    setTimeout(() => {
      const newPhotos: GeneratedPhoto[] = prompts.map((prompt, index) => ({
        id: `photo-${Date.now()}-${index}`,
        // Using Picsum to simulate results, but normally this is the output URL from Flux
        url: `https://picsum.photos/800/1000?random=${Date.now() + index}`,
        promptUsed: prompt
      }));

      setGeneratedPhotos(newPhotos);
      setIsLoading(false);
      setStep('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };

  const handleReset = () => {
    setStep('HERO');
    setGeneratedPhotos([]);
    setConfig(INITIAL_CONFIG);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/30">
      <Header />
      
      <main className="pt-16 pb-20">
        {step === 'HERO' && <Hero onStart={handleStart} />}
        
        {step === 'UPLOAD' && <UploadSection onNext={handleUploadComplete} />}
        
        {step === 'CONFIG' && (
          <ConfigPanel 
            config={config} 
            setConfig={setConfig} 
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
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