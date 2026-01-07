
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePhysiqueVisual = async (physiqueType: string) => {
  const ai = getAI();
  const prompts: Record<string, string> = {
    shredded: "Cinematic, high-definition 8k render of an elite male shredded physique, under 8% body fat, deep muscle separation, veins, professional bodybuilding lighting, black background.",
    mass_monster: "Cinematic 8k render of a powerful mass-focused male physique, thick traps, wide shoulders, extreme muscle density, professional strength athlete aesthetic.",
    athletic_lean: "Cinematic 8k render of a lean athletic male physique, sprinter/MMA build, functional muscle, high definition but natural proportions, energetic lighting.",
    functional_power: "Cinematic 8k render of a functional power physique, rugby/strongman hybrid build, massive core strength, thick neck, powerful limbs, grit and sweat aesthetic."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompts[physiqueType] || prompts['athletic_lean'] }],
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const analyzePerformance = async (user: any, latLng?: { latitude: number; longitude: number }) => {
  const ai = getAI();
  const prompt = `Perform a deep optimization analysis for ${user.name}, an ${user.origin} athlete living in ${user.residence}. 
  Current Physique Goal: ${user.targetPhysique} within ${user.targetTimeline}.
  General Goals: ${user.primaryGoals.join(', ')}. 
  Diet: ${user.dietaryPreferences.join(', ')}.
  Current Stress: ${user.stressLevel}.
  Provide a master directive and find nearby infrastructure suitable for this profile. 
  Ground the answer in real-world data from Google Search and Maps.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: latLng || { latitude: 37.7749, longitude: -122.4194 }
        }
      }
    },
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const searchProtocols = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Grounding search for: ${query}. Find elite athletic protocols, scientific research, and verified pro athlete benchmarks.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const analyzeFormAI = async (base64Image: string, exerciseName: string, user: any) => {
  const ai = getAI();
  const prompt = `Critique the exercise form in this image for: ${exerciseName}. 
  The user is aiming for a ${user.targetPhysique} physique.
  Detect key joints, alignment errors, and provide 3 "Elite Cues" to improve. 
  Return as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          alignmentNotes: { type: Type.STRING },
          safetyAlerts: { type: Type.STRING },
          eliteCues: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["overallScore", "alignmentNotes", "safetyAlerts", "eliteCues"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeMealImage = async (base64Image: string, user: any) => {
  const ai = getAI();
  const prompt = `Analyze this meal image for an elite athlete aiming for ${user.targetPhysique} in ${user.targetTimeline}. 
  Profile: ${user.origin} heritage, goal: ${user.primaryGoals.join(', ')}.
  Provide name of the item, protocol match status, macros (Protein, Carbs, Fats, Calories), metabolic impact, and a recommendation.
  Return as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          protocolMatch: { type: Type.STRING },
          macros: {
            type: Type.OBJECT,
            properties: {
              Protein: { type: Type.NUMBER },
              Carbs: { type: Type.NUMBER },
              Fats: { type: Type.NUMBER },
              Calories: { type: Type.NUMBER }
            },
            required: ["Protein", "Carbs", "Fats", "Calories"]
          },
          metabolicImpact: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["item", "protocolMatch", "macros", "metabolicImpact", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateRitualVideo = async (prompt: string) => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic visualization of a pro athlete's ritual: ${prompt}. Hyper-realistic, 8k, inspirational lighting.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  return operation;
};
