import { GoogleGenAI, Type } from "@google/genai";
import { AtsAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (
  resumeBase64: string,
  resumeMimeType: string,
  jobDescription: string
): Promise<AtsAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resumeMimeType,
              data: resumeBase64,
            },
          },
          {
            text: `You are an expert ATS (Applicant Tracking System) and Career Coach. 
            Analyze the attached resume against the following Job Description.
            
            JOB DESCRIPTION:
            ${jobDescription}
            
            Provide a strict JSON response evaluating the match.
            The score should be an integer between 0 and 100 based on keyword matching, experience relevance, and formatting.
            Be critical but constructive.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Overall match score from 0 to 100" },
            summary: { type: Type.STRING, description: "A brief 2-3 sentence summary of the evaluation." },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-5 strong points in the resume regarding this job."
            },
            weaknesses: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-5 weak points or gaps."
            },
            missingKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Important keywords or skills from the JD found missing in the resume."
            },
            formattingIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Any formatting issues that might trip up an ATS (e.g., tables, columns, graphics)."
            },
            improvementPlan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable steps to improve the score."
            },
          },
          required: ["score", "summary", "strengths", "weaknesses", "missingKeywords", "formattingIssues", "improvementPlan"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini API");
    }

    const result = JSON.parse(response.text) as AtsAnalysisResult;
    return result;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
