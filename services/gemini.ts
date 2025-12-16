import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, AspectRatio } from "../types";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const generateImageFromGemini = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<GeneratedImage> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    let imageUrl: string | null = null;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${base64Data}`;
          break; // Found the image, stop searching
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in the response. The model may have returned text instead.");
    }

    return {
      id: generateId(),
      url: imageUrl,
      prompt,
      aspectRatio,
      timestamp: Date.now()
    };

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};