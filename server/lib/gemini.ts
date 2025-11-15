// Blueprint reference: javascript_gemini
import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const PLATFORM_API_KEY = process.env.GEMINI_API_KEY || "";

export function getGeminiClient(userApiKey?: string) {
  const apiKey = userApiKey || PLATFORM_API_KEY;
  if (!apiKey) {
    throw new Error("No Gemini API key available");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateCode(prompt: string, systemPrompt?: string, userApiKey?: string): Promise<string> {
  const ai = getGeminiClient(userApiKey);
  
  const fullPrompt = systemPrompt 
    ? `${systemPrompt}\n\nUser request: ${prompt}`
    : prompt;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
  });

  return response.text || "No response from AI";
}

export async function analyzeImage(base64Image: string, prompt: string, userApiKey?: string): Promise<string> {
  const ai = getGeminiClient(userApiKey);

  const contents = [
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    },
    prompt || "Analyze this image in detail and describe what code or UI it represents. If it's a screenshot of code, extract the code. If it's a UI mockup, describe how to build it.",
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });

  return response.text || "";
}
