
import { GoogleGenAI, Type } from "@google/genai";
import { AtsAnalysisResult } from "../frontend/types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performAtsAnalysis = async (
  resumeBase64: string,
  resumeMimeType: string,
  jobDescription: string
): Promise<AtsAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: resumeMimeType, data: resumeBase64 } },
        { text: `Analyze this resume for match with JD: ${jobDescription}. Output JSON with score, summary, strengths, weaknesses, missingKeywords, formattingIssues, and improvementPlan.` }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER },
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "summary", "strengths", "weaknesses", "missingKeywords", "formattingIssues", "improvementPlan"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const generateOptimizedResume = async (
  resumeBase64: string,
  resumeMimeType: string,
  jobDescription: string,
  analysis: AtsAnalysisResult
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: resumeMimeType, data: resumeBase64 } },
        { text: `Rewrite this resume to optimize for JD: ${jobDescription}. Target these keywords: ${analysis.missingKeywords.join(', ')}. Keep original structure. Return high-quality HTML with embedded CSS.` }
      ],
    },
  });

  let html = response.text || "";
  return html.replace(/```html/g, "").replace(/```/g, "").trim();
};
