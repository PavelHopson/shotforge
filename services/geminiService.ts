import { GoogleGenAI } from "@google/genai";
import { UserConfig, Preset, FaceAnalysis, AspectRatio, ImageResolution, AIProviderConfig, AIProvider, FusionAssetMap, FusionAssetType } from "../types";
import { PRESETS } from "../constants";

// --- AI Config persistence (localStorage) ---

const AI_CONFIG_KEY = 'shotforge_ai_config';

export const getAIConfig = (): AIProviderConfig => {
  try {
    const stored = localStorage.getItem(AI_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    provider: 'gemini',
    apiKey: process.env.API_KEY || '',
    model: 'gemini-2.5-flash'
  };
};

export const saveAIConfig = (config: AIProviderConfig): void => {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
};

// Get active API key: localStorage config takes priority, then env
const getActiveApiKey = (): string => {
  const config = getAIConfig();
  return config.apiKey || process.env.API_KEY || '';
};

// Initialize Gemini Client (lazy, uses active key)
const getGeminiClient = (): GoogleGenAI => {
  return new GoogleGenAI({ apiKey: getActiveApiKey() });
};

// Legacy alias for existing code
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Utility from ModelForge ---

/**
 * Converts a File object to a Base64 string (without data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

// --- Original Shotforge: Director Prompts ---

/**
 * Uses Gemini 2.5 Flash as a Creative Director to generate optimized prompts for Flux/SDXL.
 */
export const generateDirectorPrompts = async (config: UserConfig): Promise<string[]> => {
  const selectedPreset = PRESETS.find(p => p.id === config.presetId) || PRESETS[0];

  const systemInstruction = `
    You are a world-class Photography Director and Prompt Engineer for Flux.1 and Midjourney v6.
    Your goal is to take user parameters and convert them into 4 DISTINCT, highly detailed, photorealistic image prompts.

    Technical Rules:
    1. Output MUST be a JSON array of strings.
    2. Focus on lighting, texture, skin details, and camera settings.
    3. Use keywords like "8k", "ultra-detailed", "masterpiece".
    4. Incorporate the style of: ${selectedPreset.name} - ${selectedPreset.description}.
    5. Avoid generic terms. Be specific about lens type and lighting setup.
  `;

  const userPrompt = `
    Subject: ${config.age} year old ${config.gender}
    Emotion: ${config.emotion}
    Clothing: ${config.clothing}
    Lighting Setup: ${config.lighting}
    Camera Angle: ${config.camera}

    Generate 4 unique prompt variations based on this configuration.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return ["Error generating prompts"];

    const prompts = JSON.parse(text);
    return Array.isArray(prompts) ? prompts : [text];

  } catch (error) {
    console.error("Gemini Director failed:", error);
    return [
      `Professional portrait of ${config.age} year old ${config.gender}, ${selectedPreset.name} style, ${config.lighting}, 8k, photorealistic.`
    ];
  }
};

// --- From ModelForge: Face Analysis ---

/**
 * Analyzes an uploaded image to extract facial and stylistic features.
 * Uses Gemini 2.5 Flash for speed and multimodal capabilities.
 */
export const analyzeImageFeatures = async (base64Image: string): Promise<FaceAnalysis> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided. Returning mock analysis.");
    return {
      faceShape: "Oval",
      skinTone: "Medium",
      hairColor: "Dark Brown",
      bodyType: "Athletic",
      styleKeywords: ["Chic", "Modern", "Urban"]
    };
  }

  try {
    const prompt = `
      Analyze this image of a person. Extract the following details in JSON format.

      Keys to extract:
      - faceShape (e.g., Oval, Round, Square, Heart)
      - skinTone (e.g., Fair, Medium, Olive, Dark)
      - hairColor (e.g., Blonde, Brown, Black, Red)
      - bodyType (if visible, e.g., Athletic, Slim, Average)
      - styleKeywords (clothing style, vibe, e.g., ["Casual", "Formal", "Streetwear"])

      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");

    return JSON.parse(text) as FaceAnalysis;

  } catch (error) {
    console.error("Gemini Face Analysis Error:", error);
    // Graceful fallback instead of throwing
    return {
      faceShape: "Unknown",
      skinTone: "Unknown",
      hairColor: "Unknown",
      bodyType: "Unknown",
      styleKeywords: ["General"]
    };
  }
};

// --- From ModelForge: Real Image Generation ---

/**
 * Generates a new image using Gemini 3 Pro Image Preview.
 * Falls back to picsum placeholder if no API key is set.
 */
export const generateImage = async (
  prompt: string,
  referenceImageBase64: string | null,
  aspectRatio: AspectRatio = "1:1",
  resolution: ImageResolution = "1K"
): Promise<string> => {
  if (!process.env.API_KEY) {
    // Return a random placeholder if no key
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '9:16') { width = 720; height = 1280; }
    if (aspectRatio === '16:9') { width = 1280; height = 720; }
    if (aspectRatio === '3:4') { width = 768; height = 1024; }
    if (aspectRatio === '4:3') { width = 1024; height = 768; }

    return new Promise(resolve => {
      setTimeout(() => resolve(`https://picsum.photos/${width}/${height}?random=${Date.now()}`), 2000);
    });
  }

  try {
    const model = 'gemini-3-pro-image-preview';

    const parts: any[] = [{ text: prompt }];

    if (referenceImageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: referenceImageBase64
        }
      });
      parts.push({ text: "Maintain the facial identity and key physical features of the person in the image, but adapt the style, pose, and background as described." });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution
        }
      }
    });

    // Extract the generated image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

// --- From StreamForge-AI: Style Analysis ---

/**
 * Analyzes a reference image to extract style, mood, lighting, and color palette.
 * Useful for style-transfer generation mode.
 */
export const analyzeImageStyle = async (base64Image: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Modern photographic style with balanced natural lighting, warm tones, and clean composition.";
  }

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

    const prompt = `
      Analyze this image specifically for photographic and design purposes.
      Identify the following elements and list them clearly:
      1. Art Style (e.g., Cyberpunk, Minimalist, Grunge, Editorial, Cinematic)
      2. Color Palette (specific descriptive color names)
      3. Lighting composition (e.g., Neon glow, flat lighting, cinematic rim light)
      4. Texture details (e.g., Grainy, smooth, metallic, watercolor)

      Summarize this into a single, dense paragraph that describes the visual style.
      Respond in English.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          }
        ]
      }
    });

    return response.text || "Failed to extract style description.";
  } catch (error: any) {
    console.error("Style Analysis failed:", error);
    return "Could not analyze style. Using default settings.";
  }
};

// --- Face Fusion functions (merged from AI-Face-Fusion-Pro) ---

/**
 * Analyzes multiple asset images to create a unified descriptive prompt for face fusion.
 */
export const analyzeFusionAssets = async (assets: FusionAssetMap): Promise<string> => {
  const client = getGeminiClient();

  const parts: any[] = [];

  parts.push({
    text: `
      You are a Lead Visual Director for a high-end fashion shoot.
      Your task is to analyze the provided reference images and combine them into a SINGLE, cohesive visual description for a generative AI model.

      I will provide images labeled by their category (e.g., Clothing, Shoes, Style, Hairstyle).
      You must merge these elements into a scene description.

      **Directives:**
      1. If 'Style/Background' is provided, describe the lighting, location, and camera angle in detail.
      2. If 'Clothing' or 'Shoes' are provided, describe their fabric, cut, color, and how they fit on a model.
      3. If 'Hairstyle' is provided, describe the hair texture and cut.
      4. If 'Accessories' are provided, include them naturally.

      Output the final detailed description in English.

      **Output Format:**
      Return ONLY the descriptive paragraph. Do not add intro/outro text.
    `
  });

  const addPart = (type: FusionAssetType, label: string) => {
    const img = assets[type];
    if (img) {
      parts.push({ text: `\n[REFERENCE IMAGE: ${label}]` });
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    }
  };

  addPart('style', 'TARGET STYLE / ENVIRONMENT');
  addPart('clothing', 'CLOTHING TO WEAR');
  addPart('shoes', 'SHOES TO WEAR');
  addPart('accessories', 'ACCESSORIES');
  addPart('hairstyle', 'HAIRSTYLE');

  const config = getAIConfig();
  const model = config.provider === 'gemini' ? 'gemini-2.5-flash' : 'gemini-2.5-flash';

  const response = await client.models.generateContent({
    model,
    contents: { parts }
  });

  return response.text || "";
};

/**
 * Generates the final composite image using ALL provided assets for face fusion.
 */
export const generateFusionImage = async (
  assets: FusionAssetMap,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  const client = getGeminiClient();
  const model = 'gemini-2.5-flash-image';

  const systemInstruction = `
    You are an expert CGI Artist and Photographer.
    Task: Create a photorealistic composite image based on the provided references.

    **CORE INSTRUCTION**:
    Synthesize a single image that combines the anatomical features of the [FACE_REFERENCE] with the aesthetic elements of the other references.

    **STRICT ASSET MAPPING**:
    1. **FACE / IDENTITY**: The generated person MUST have the facial structure, ethnicity, and key features of [FACE_REFERENCE]. This is the most critical requirement.
    2. **OUTFIT**: The person MUST be wearing the exact items shown in [CLOTHING_REFERENCE] and [SHOES_REFERENCE]. Maintain fabric texture and details.
    3. **SCENE**: The background, lighting, and mood must match [STYLE_REFERENCE].
    4. **HAIR**: If [HAIRSTYLE_REFERENCE] is provided, adapt that hair onto the subject.

    **SCENE DESCRIPTION**:
    "${prompt}"

    **TECHNICAL PARAMETERS**:
    - Style: Photorealistic, 8k resolution, cinematic lighting.
    - Shot: Medium shot or Full body (depending on visible clothing).
    - Integrity: Ensure the face blends naturally with the neck and lighting of the scene.
  `;

  const parts: any[] = [];
  parts.push({ text: systemInstruction });

  if (assets.face) {
    parts.push({ text: "Reference 1: [FACE_REFERENCE] - Use this for facial identity." });
    parts.push({ inlineData: { data: assets.face.data, mimeType: assets.face.mimeType } });
  }

  const assetTypes: { type: FusionAssetType; label: string; instruction: string }[] = [
    { type: 'style', label: 'STYLE_REFERENCE', instruction: 'Use this for background and lighting.' },
    { type: 'clothing', label: 'CLOTHING_REFERENCE', instruction: 'Use this for the main outfit.' },
    { type: 'shoes', label: 'SHOES_REFERENCE', instruction: 'Use this for footwear.' },
    { type: 'accessories', label: 'ACCESSORIES_REFERENCE', instruction: 'Include these accessories.' },
    { type: 'hairstyle', label: 'HAIRSTYLE_REFERENCE', instruction: 'Use this hairstyle.' }
  ];

  for (const asset of assetTypes) {
    const img = assets[asset.type];
    if (img) {
      parts.push({ text: `Reference: [${asset.label}] - ${asset.instruction}` });
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    }
  }

  const response = await client.models.generateContent({
    model,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ]
    }
  });

  const candidate = response.candidates?.[0];

  if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
    let errorMsg = `Generation failed. Reason: ${candidate.finishReason}.`;
    if (candidate.finishReason === 'SAFETY') {
      errorMsg = "Blocked by Safety Filters. Try a different face photo or simpler clothing.";
    }
    if (candidate.finishReason === 'RECITATION') {
      errorMsg = "Copyright check triggered. Try a different outfit image.";
    }
    if (candidate.finishReason === 'OTHER' || candidate.finishReason === 'IMAGE_OTHER') {
      errorMsg = "Model refused the combination. Try a Style image that matches the lighting of your Face photo.";
    }
    throw new Error(errorMsg);
  }

  let textFallback = "";
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        textFallback += part.text;
      }
    }
  }

  if (textFallback) {
    throw new Error(`Model Refusal: ${textFallback.substring(0, 300)}...`);
  }

  throw new Error(`No image generated. Try refreshing or changing input images.`);
};
