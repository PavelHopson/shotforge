import { Preset, Gender, Emotion, Lighting, CameraAngle } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'old-money',
    name: 'Old Money Aesthetic',
    description: 'Quiet luxury, linen, yacht club vibes, soft natural light.',
    image: 'https://picsum.photos/400/600?random=1',
    isPro: false
  },
  {
    id: 'vogue-editorial',
    name: 'Vogue Editorial',
    description: 'High fashion, sharp contrast, studio background, haute couture.',
    image: 'https://picsum.photos/400/600?random=2',
    isPro: false
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Tokyo',
    description: 'Neon lights, rain, wet asphalt, futuristic tech wear.',
    image: 'https://picsum.photos/400/600?random=3',
    isPro: true
  },
  {
    id: 'corporate-headshot',
    name: 'LinkedIn Pro',
    description: 'Clean background, confident smile, business attire.',
    image: 'https://picsum.photos/400/600?random=4',
    isPro: false
  },
  {
    id: 'film-noir',
    name: 'Film Noir',
    description: 'Black and white, dramatic shadows, mysterious atmosphere.',
    image: 'https://picsum.photos/400/600?random=5',
    isPro: true
  },
  {
    id: 'cinematic-adventure',
    name: 'Cinematic Adventure',
    description: 'Outdoor, epic landscape, golden hour, travel influencer.',
    image: 'https://picsum.photos/400/600?random=6',
    isPro: true
  }
];

export const INITIAL_CONFIG = {
  gender: Gender.FEMALE,
  age: 28,
  emotion: Emotion.CONFIDENT,
  lighting: Lighting.STUDIO,
  camera: CameraAngle.PORTRAIT_85MM,
  clothing: 'Business Casual',
  presetId: 'vogue-editorial'
};