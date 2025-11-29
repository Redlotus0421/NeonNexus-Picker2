import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WinnerResult } from '../types';

// Initialize Gemini Client
// IMPORTANT: The API key must be obtained exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const oracleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    winner: {
      type: Type.STRING,
      description: "The name of the chosen winner from the provided list.",
    },
    reason: {
      type: Type.STRING,
      description: "A futuristic, sci-fi, or cyberpunk reason for why this individual was selected for the mission. Max 2 sentences.",
    },
    missionId: {
      type: Type.STRING,
      description: "A generated alphanumeric mission ID (e.g., OMEGA-X9).",
    },
  },
  required: ["winner", "reason", "missionId"],
};

export const selectWinnerWithAI = async (candidates: string[]): Promise<WinnerResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are the Central Mainframe of a futuristic city. 
      You need to select one individual from the following list of candidates for a high-priority protocol.
      
      Candidates: ${candidates.join(', ')}
      
      Select one winner randomly but provide a creative cyberpunk backstory for the selection.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: oracleSchema,
        temperature: 1, // High temperature for variety
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Oracle");
    }

    const data = JSON.parse(jsonText);
    
    // Fallback if AI hallucinates a name not in the list (rare but possible with high temp)
    // We strictly trust the AI for the flavor, but let's just return what it gave.
    return {
      name: data.winner,
      reason: data.reason,
      missionId: data.missionId
    };

  } catch (error) {
    console.error("Oracle Malfunction:", error);
    // Fallback to local random if AI fails
    const randomName = candidates[Math.floor(Math.random() * candidates.length)];
    return {
      name: randomName,
      reason: "Oracle connection interrupted. Emergency local protocol initiated.",
      missionId: `ERR-${Math.floor(Math.random() * 9999)}`
    };
  }
};
