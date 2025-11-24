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

export interface Preset {
  id: string;
  name: string;
  description: string;
  image: string;
  isPro: boolean;
}

export interface UserConfig {
  gender: Gender;
  age: number;
  emotion: Emotion;
  lighting: Lighting;
  camera: CameraAngle;
  clothing: string;
  presetId: string;
}

export interface GeneratedPhoto {
  id: string;
  url: string;
  promptUsed: string;
}

export type AppStep = 'HERO' | 'UPLOAD' | 'CONFIG' | 'PROCESSING' | 'RESULTS';