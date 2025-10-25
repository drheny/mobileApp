
import { GoogleGenAI } from "@google/genai";

// FIX: Use process.env.API_KEY directly as per guidelines.
if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

// FIX: Initialize with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyTip = async (): Promise<string> => {
  // FIX: Check process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    return Promise.resolve("N'oubliez pas de bien hydrater votre enfant tout au long de la journée, surtout par temps chaud.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Génère un conseil de santé pédiatrique court et simple pour les parents en une seule phrase. Le ton doit être rassurant, positif et facile à comprendre. Ne pas inclure de préambule comme 'Voici un conseil :'.",
      config: {
        temperature: 0.8,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching daily tip from Gemini:", error);
    return "La lecture d'une histoire avant de dormir est un excellent rituel pour apaiser votre enfant.";
  }
};
