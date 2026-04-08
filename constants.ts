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
  },
  {
    id: 'manga-anime',
    name: 'Manga / Anime',
    description: 'Japanese manga style, cel shading, dynamic poses, expressive eyes.',
    image: 'https://picsum.photos/400/600?random=7',
    isPro: false
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art Retro',
    description: '16-bit pixel art, retro game aesthetic, crisp pixels, nostalgic palette.',
    image: 'https://picsum.photos/400/600?random=8',
    isPro: false
  },
  {
    id: 'product-photo',
    name: 'Product Photography',
    description: 'Clean white/gradient background, studio lighting, commercial packaging shot.',
    image: 'https://picsum.photos/400/600?random=9',
    isPro: false
  },
  {
    id: '3d-isometric',
    name: '3D Isometric',
    description: 'Isometric 3D render, miniature scene, tilt-shift, vibrant colors.',
    image: 'https://picsum.photos/400/600?random=10',
    isPro: true
  },
  {
    id: 'ukiyo-e',
    name: 'Ukiyo-e 浮世絵',
    description: 'Japanese woodblock print, flat colors, wave patterns, Hokusai style.',
    image: 'https://picsum.photos/400/600?random=11',
    isPro: true
  },
  {
    id: 'lego-miniature',
    name: 'LEGO Miniature',
    description: 'LEGO brick figure, miniature diorama, toy photography, macro lens.',
    image: 'https://picsum.photos/400/600?random=12',
    isPro: true
  },
  {
    id: 'comic-book',
    name: 'Comic Book',
    description: 'American comic book style, bold outlines, halftone dots, speech bubbles.',
    image: 'https://picsum.photos/400/600?random=13',
    isPro: false
  },
  {
    id: 'watercolor-portrait',
    name: 'Watercolor Portrait',
    description: 'Soft watercolor, paper texture, bleeding edges, pastel palette.',
    image: 'https://picsum.photos/400/600?random=14',
    isPro: false
  },
  {
    id: 'hyper-real-selfie',
    name: 'Hyper-Real Selfie',
    description: 'Ultra-realistic mirror selfie, visible pores, natural skin texture, phone-camera grain, no retouching.',
    image: 'https://picsum.photos/400/600?random=15',
    isPro: true
  },
  {
    id: 'macro-skin',
    name: 'Macro Skin Realism',
    description: 'Extreme close-up macro photography, visible pores, fine lines, natural sheen, unretouched editorial beauty.',
    image: 'https://picsum.photos/400/600?random=16',
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