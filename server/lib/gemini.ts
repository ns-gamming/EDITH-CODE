
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function generateCode(
  prompt: string,
  systemPrompt?: string,
  userApiKey?: string,
  projectContext?: any
): Promise<string> {
  const apiKey = userApiKey || GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please add your API key in settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const contextPrompt = projectContext
    ? `Project Context:\nFiles: ${JSON.stringify(projectContext.files || [])}\n\n`
    : "";

  const fullPrompt = `${systemPrompt || "You are EDITH, an expert AI coding assistant. Generate clean, production-ready code with proper comments and error handling."}\n\n${contextPrompt}User Request: ${prompt}\n\nProvide the complete code implementation:`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
}

export async function analyzeImage(
  base64Image: string,
  prompt: string,
  userApiKey?: string
): Promise<string> {
  const apiKey = userApiKey || GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is required for image analysis.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const imageParts = [
    {
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: "image/png",
      },
    },
  ];

  const result = await model.generateContent([
    prompt || "Analyze this image and extract any code, UI design, or technical information you can find. Provide a detailed description.",
    ...imageParts,
  ]);
  
  const response = await result.response;
  return response.text();
}

export async function chatWithAI(
  messages: { role: string; content: string }[],
  userApiKey?: string
): Promise<string> {
  const apiKey = userApiKey || GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is required.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const chat = model.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = await result.response;
  
  return response.text();
}
