import { GoogleGenAI } from "@google/genai";
import { UserConfig, Preset } from "../types";
import { PRESETS } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Pavel's Note:
 * This is the brain of the operation. We don't just concatenate strings.
 * We use Gemini 2.5 Flash (fast & smart) to act as a Creative Director.
 * It takes the user's boring inputs and transforms them into a prompt optimized for Flux.1/SDXL.
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
    
    // Parse the JSON array
    const prompts = JSON.parse(text);
    return Array.isArray(prompts) ? prompts : [text];
    
  } catch (error) {
    console.error("Gemini Director failed:", error);
    // Fallback if API fails
    return [
      `Professional portrait of ${config.age} year old ${config.gender}, ${selectedPreset.name} style, ${config.lighting}, 8k, photorealistic.`
    ];
  }
};