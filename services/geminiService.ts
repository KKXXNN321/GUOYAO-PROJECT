import { GoogleGenAI } from "@google/genai";
import { Project, MonthlyData } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProjectReport = async (project: Project): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Prepare context from project data
    const last3Months = project.monthlyData.slice(-3);
    const dataSummary = last3Months.map(d => 
      `Month: ${d.month}, Actual Sales: ${d.actualSales}, Target: ${d.targetSales}, Coverage: ${d.hospitalCoverage}, Activities: ${d.activities}`
    ).join('\n');

    const prompt = `
      Act as a senior Pharmaceutical Project Manager. 
      Analyze the following data for the project "${project.name}" (Manufacturer: ${project.manufacturer}).
      
      Recent Data:
      ${dataSummary}
      
      Please provide a concise monthly progress report in Chinese (Professional Tone).
      Structure:
      1. Sales Performance Analysis (Achievement rate, Trend).
      2. Key Highlights (Based on activities).
      3. Strategic Suggestions for next month.
      
      Keep it brief (under 200 words) and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating report. Please check your API key or network connection.";
  }
};
