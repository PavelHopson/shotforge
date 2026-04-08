export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NEUTRAL = 'Neutral'
}

export enum Emotion {
  SERIOUS = 'Serious / Professional',
  SMILING = 'Warm Smile',
  DREAMY = 'Dreamy / Soft',
  CONFIDENT = 'Bold / Confident',
  SEDULOUS = 'Sedulous / Intense'
}

export enum Lighting {
  STUDIO = 'Softbox Studio',
  NATURAL = 'Golden Hour',
  NEON = 'Cyberpunk Neon',
  DRAMATIC = 'Dramatic Rim Light',
  CINEMATIC = 'Cinematic Teal/Orange'
}

export enum CameraAngle {
  PORTRAIT_85MM = '85mm Portrait (Bokeh)',
  WIDE_35MM = '35mm Editorial',
  CLOSEUP_MACRO = 'Macro Beauty Shot',
  FULL_BODY = 'Full Body Fashion'
}

export enum Pose {
  NATURAL = 'Natural / Relaxed',
  STANDING = 'Standing Confident',
  SITTING = 'Sitting Casual',
  WALKING = 'Walking Dynamic',
  LEANING = 'Leaning Against Wall',
  CROSSED_ARMS = 'Arms Crossed',
  HANDS_IN_POCKETS = 'Hands in Pockets',
  LOOKING_AWAY = 'Looking Away / Profile'
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  image: string;
  isPro: boolean;
  isCustom?: boolean;
  config?: Partial<UserConfig>;
  createdAt?: number;
}

export interface UserConfig {
  gender: Gender;
  age: number;
  emotion: Emotion;
  lighting: Lighting;
  camera: CameraAngle;
  clothing: string;
  presetId: string;
  // Extended settings
  background: string;
  pose: Pose;
  accessories: string;
  imageCount: number;
}

export interface GeneratedPhoto {
  id: string;
  url: string;
  promptUsed: string;
}

export type AppStep = 'HERO' | 'UPLOAD' | 'CONFIG' | 'PROMPTS' | 'PROCESSING' | 'RESULTS';

// --- Merged from ModelForge ---

export interface FaceAnalysis {
  faceShape?: string;
  skinTone?: string;
  hairColor?: string;
  bodyType?: string;
  styleKeywords?: string[];
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageResolution = '1K' | '2K';

// --- Merged from StreamForge-AI ---

export type GenerationMode = 'portrait' | 'style-transfer' | 'streamer-asset';

export type AppState = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'prompts-ready' | 'complete' | 'error';

export interface StyleAnalysis {
  description: string;
  rawResponse: string;
}

// --- Multi-provider AI Settings ---

export type AIProvider = 'gemini' | 'openai' | 'openrouter' | 'ollama';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-pro-image-preview'],
  openai: ['gpt-image-1', 'dall-e-3', 'gpt-4o'],
  openrouter: ['google/gemini-2.5-flash', 'openai/gpt-4o', 'anthropic/claude-sonnet-4', 'meta-llama/llama-4-maverick'],
  ollama: ['huihui-ai/Huihui-Qwen3.5-35B-A3B-abliterated', 'llama3.2-vision', 'llava']
};

// --- Face Fusion Types (from AI-Face-Fusion-Pro) ---

export type FusionAssetType = 'face' | 'clothing' | 'shoes' | 'accessories' | 'hairstyle' | 'style';

export interface FusionImageFile {
  data: string; // base64
  mimeType: string;
}

export type FusionAssetMap = Partial<Record<FusionAssetType, FusionImageFile>>;

// --- App Mode ---

export type AppMode = 'photographer' | 'face-fusion' | 'style-transfer';

// --- Generation History ---

export interface GenerationSession {
  id: string;
  timestamp: number;
  mode: AppMode;
  presetName: string;
  config: UserConfig;
  photos: GeneratedPhoto[];
  uploadedThumbnail?: string;
}

// --- Generation Progress ---

export interface GenerationProgress {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  percent: number;
}
