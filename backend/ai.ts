
import { GoogleGenAI, Type } from "@google/genai";
import { AtsAnalysisResult } from "../frontend/types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performAtsAnalysis = async (
  resumeBase64: string,
  resumeMimeType: string,
  jobDescription: string
): Promise<AtsAnalysisResult> => {
  // Using gemini-3-flash-preview for high-speed multi-modal analysis with Google Search Grounding
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: resumeMimeType, data: resumeBase64 } },
        { text: `
          TASK: Act as an expert ATS (Applicant Tracking System) and Executive Career Coach.
          
          1. ANALYZE: Compare the attached resume against this Job Description: "${jobDescription}".
          2. RESEARCH: Identify the hiring company from the Job Description. Use the Google Search tool to find their core mission, recent major news (within last 12 months), and company culture.
          3. STRATEGIZE: Based on your research, provide 3 specific talking points or interview tips that would help this candidate stand out to this specific employer.
          4. OUTPUT: Provide a single JSON object.

          JSON STRUCTURE:
          - score (int 0-100)
          - summary (concise professional overview)
          - strengths (array of strings)
          - weaknesses (array of gaps)
          - missingKeywords (array of specific skills missing)
          - formattingIssues (array of ATS readability warnings)
          - improvementPlan (step-by-step optimization guide)
          - research: {
              companyName (string),
              recentNews (one paragraph summary of search findings),
              interviewTips (array of 3 strategic talking points),
              sources (array of objects with title and uri)
            }
        ` }
      ],
    },
    config: {
      tools: [{ googleSearch: {} }],
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
          research: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              recentNews: { type: Type.STRING },
              interviewTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["companyName", "recentNews", "interviewTips"]
          }
        },
        required: ["score", "summary", "strengths", "weaknesses", "missingKeywords", "formattingIssues", "improvementPlan", "research"],
      },
    },
  });

  const parsed = JSON.parse(response.text || "{}");
  
  // Extract real grounding sources from metadata to ensure accuracy
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Search Reference",
    uri: chunk.web?.uri || "#"
  })).filter((s: any) => s.uri !== "#") || [];

  if (parsed.research) {
    parsed.research.sources = groundingSources.length > 0 ? groundingSources : (parsed.research.sources || []);
  }

  return parsed;
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
        { text: `
          Act as a professional resume re-writer. 
          Rewrite this resume to optimize it for this Job Description: ${jobDescription}. 
          Target these missing keywords: ${analysis.missingKeywords.join(', ')}. 
          
          STRICT RULES:
          1. Keep the exact original section structure.
          2. Optimize bullet points for impact and keyword density.
          3. Return ONLY valid HTML with embedded CSS.
          4. Use clean, professional styling (Arial/Helvetica).
        ` }
      ],
    },
  });

  let html = response.text || "";
  return html.replace(/```html/g, "").replace(/```/g, "").trim();
};
