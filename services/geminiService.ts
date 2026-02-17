import { GoogleGenAI, Type } from "@google/genai";

export const fetchUrlMetadata = async (url: string): Promise<{ title: string; description: string }> => {
  // @google/genai Fix: Use process.env.API_KEY directly as per SDK initialization rules
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Fetch and summarize information for the following URL: ${url}. Provide a concise title and a short description (max 2 sentences).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    // @google/genai Fix: Access the text property directly on the GenerateContentResponse object
    const result = JSON.parse(response.text || '{}');
    return {
      title: result.title || "Untitled Bookmark",
      description: result.description || "No description provided."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "New Bookmark",
      description: "Failed to fetch metadata automatically."
    };
  }
};