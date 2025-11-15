import { GoogleAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function generateCode(
  prompt: string,
  systemPrompt?: string,
  userApiKey?: string,
  projectContext?: any
): Promise<string> {
  if (!userApiKey && !GEMINI_API_KEY) {
    throw new Error("Gemini API key is required. Please add your API key in settings.");
  }

  const genAI = userApiKey ? new GoogleAI({ apiKey: userApiKey }) : GEMINI_API_KEY ? new GoogleAI({ apiKey: GEMINI_API_KEY }) : null;

  if (!genAI) {
    throw new Error("Gemini client not initialized. Please check your API key.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const contextPrompt = projectContext
    ? `Project Context:\nFiles: ${JSON.stringify(projectContext.files || [])}\n\n`
    : "";

  const systemMessage = systemPrompt || "You are EDITH, an expert AI coding assistant. Generate clean, production-ready code with proper comments and error handling. Always provide complete, working code without placeholders or ellipsis.";

  const fullPrompt = `${systemMessage}\n\n${contextPrompt}User Request: ${prompt}\n\nProvide the complete code implementation with all necessary imports, types, and error handling:`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
  });

  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
}

export async function analyzeImage(
  base64Image: string,
  prompt: string,
  userApiKey?: string
): Promise<string> {
  if (!userApiKey && !GEMINI_API_KEY) {
    throw new Error("Gemini API key is required for image analysis.");
  }

  const genAI = userApiKey ? new GoogleAI({ apiKey: userApiKey }) : GEMINI_API_KEY ? new GoogleAI({ apiKey: GEMINI_API_KEY }) : null;

  if (!genAI) {
    throw new Error("Gemini client not initialized. Please check your API key.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  const analyzePrompt = prompt || "Analyze this image and extract any code, UI design, or technical information you can find. If it contains code, provide the complete implementation. If it's a UI design, describe it in detail and suggest HTML/CSS/JS implementation.";

  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [
        { text: analyzePrompt },
        {
          inlineData: {
            mimeType: "image/png",
            data: imageData
          }
        }
      ]
    }]
  });

  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
}

export async function chatWithAI(
  messages: { role: string; content: string }[],
  userApiKey?: string,
  systemPrompt?: string
): Promise<string> {
  if (!userApiKey && !GEMINI_API_KEY) {
    throw new Error("Gemini API key is required.");
  }

  const genAI = userApiKey ? new GoogleAI({ apiKey: userApiKey }) : GEMINI_API_KEY ? new GoogleAI({ apiKey: GEMINI_API_KEY }) : null;

  if (!genAI) {
    throw new Error("Gemini client not initialized. Please check your API key.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: systemPrompt || "You are EDITH, an expert AI coding assistant. Help users build amazing projects with clear, complete code and explanations."
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);

  return result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
}