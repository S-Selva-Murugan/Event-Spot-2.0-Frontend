import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // make sure you add this to .env.local
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const fullPrompt = `
You are Event Spot's AI Assistant.
Only answer questions about our app, events, or services.
If the question is unrelated, respond with: 
"I’m sorry, I can’t answer that. Please write an email or call us."

User question: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
    {
      text: fullPrompt, // your system instructions + user question
    },
  ],
      config: {
        systemInstruction: "You are a robot, Your name is Namitha",
        thinkingConfig: {
          thinkingBudget: 0, // disables thinking
        },
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong!" },
      { status: 500 }
    );
  }
}
