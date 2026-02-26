
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

// Initialize only if API key is available
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const isAIAvailable = () => !!ai;

export const generateBookResponse = async (userQuery: string): Promise<string> => {
  if (!ai) {
    return "AI Assistant is currently unavailable. Please configure your API key to enable this feature.";
  }

  const inventoryContext = PRODUCTS.map(p =>
    `- [${p.type}] "${p.title}" by ${p.creator} ($${p.price}): ${p.description}`
  ).join('\n');

  const systemInstruction = `
    You are "Redex Assistant", an expert commerce guide for the Redex Digital Marketplace (like Selar).
    We sell eBooks, Courses, Tickets, and Services.
    
    Inventory:
    ${inventoryContext}

    Rules:
    1. Help users find digital products or services.
    2. Recommend based on their specific needs (learning, business, dev, etc).
    3. Be concise and encouraging!
    4. Mention if it's a "Course", "eBook", or "Ticket".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm not sure how to answer that. Want to see our top-selling courses?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong in the marketplace lab. Try again in a second!";
  }
};
