
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSummaryAndKeywords = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following video description, generate a concise summary and a list of relevant keywords.
      
      Description: "${description}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise summary of the video content, maximum 3 sentences.",
            },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "A list of 5-7 relevant keywords for search optimization.",
            },
          },
          required: ["summary", "keywords"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating summary and keywords:", error);
    return { summary: "Could not generate summary.", keywords: [] };
  }
};

export const getRelatedVideoIdeas = async (title: string, description: string) => {
    try {
        const prompt = `Based on the video titled "${title}" with the description "${description}", suggest 5 titles for similar educational videos. The titles should be diverse but related.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  video_titles: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                    description: "A list of 5 related video titles."
                  }
                },
                required: ["video_titles"],
              }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.video_titles || [];
    } catch (error) {
        console.error("Error getting related video ideas:", error);
        return [];
    }
};

export const moderateContent = async (title: string, description: string) => {
    try {
        const prompt = `Analyze the following video content to determine if it's educational. Classify it as 'Educational', 'Inappropriate', or 'Uncertain'. Provide a brief reason for your classification.
        
        Title: "${title}"
        Description: "${description}"
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                    classification: {
                        type: Type.STRING,
                        description: "The content classification: 'Educational', 'Inappropriate', or 'Uncertain'."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A brief reason for the classification."
                    }
                },
                required: ["classification", "reason"]
              }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error moderating content:", error);
        return { classification: "Error", reason: "Could not perform moderation." };
    }
};
