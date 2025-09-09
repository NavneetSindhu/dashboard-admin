import { GoogleGenAI } from "@google/genai";
import type { Report } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI functionality will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateContent = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI functionality is disabled. Please configure the API_KEY environment variable.");
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        return "An error occurred while communicating with the AI. Please check the console for more details.";
    }
};

export const generateReportInsights = async (reports: Report[], language: 'en' | 'hi'): Promise<string> => {
    const langInstruction = language === 'hi' ? 'Respond in Hindi.' : 'Respond in English.';
    const prompt = `
        Analyze the following community health worker reports and generate key insights.
        Focus on:
        1.  Identifying potential disease clusters based on location and timing.
        2.  Highlighting locations with a high number of 'Pending' or 'Submitted' reports that need review.
        3.  Summarizing the overall status of reports across different cities.
        
        Format your response using Markdown (e.g., headings, bold text, lists).
        ${langInstruction}
        
        Reports Data:
        ${JSON.stringify(reports, null, 2)}
    `;
    return generateContent(prompt);
};

export const generateChartSummary = async (chartTitle: string, chartData: any, language: 'en' | 'hi'): Promise<string> => {
    const langInstruction = language === 'hi' ? 'Respond in Hindi.' : 'Respond in English.';
    const prompt = `
        Analyze the data for the chart titled "${chartTitle}" and provide a concise summary.
        Describe the main trend, any significant peaks or dips, and potential implications.
        
        Format your response using Markdown (e.g., headings, bold text, lists).
        ${langInstruction}
        
        Chart Data:
        ${JSON.stringify(chartData, null, 2)}
    `;
    return generateContent(prompt);
};

export const refineText = async (textToRefine: string, instruction: string, language: 'en' | 'hi'): Promise<string> => {
    const langInstruction = language === 'hi' ? 'Respond in Hindi.' : 'Respond in English.';
    const prompt = `
        Based on the following instruction, refine the provided text.
        Instruction: "${instruction}"

        Format your response using Markdown (e.g., headings, bold text, lists).
        ${langInstruction}

        Text to refine:
        ---
        ${textToRefine}
        ---
    `;
    return generateContent(prompt);
};