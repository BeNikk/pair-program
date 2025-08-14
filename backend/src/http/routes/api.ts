import express, { Request, Response } from "express";
const apiRouter = express.Router();
import { GoogleGenAI, Type } from "@google/genai";
import { geminikey } from "../../config/config";

const ai = new GoogleGenAI({
  apiKey: geminikey,
});

apiRouter.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "This is a test route" });
});

apiRouter.get("/chat/question", async (req: Request, res: Response) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "You are an AI coding question generator. Give a JavaScript coding question with a title, description, difficulty (Easy/Medium/Hard), example input/output, and constraints. Format it exactly as requested in the schema.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            exampleInputFirst: { type: Type.STRING },
            exampleOutputFirst: { type: Type.STRING },
            exampleInputSecond: { type: Type.STRING },
            exampleOutputSecond: { type: Type.STRING },
            constraints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          propertyOrdering: [
            "title",
            "description",
            "difficulty",
            "exampleInputFirst",
            "exampleOutputFirst",
            "exampleInputSecond",
            "exampleOutputSecond",
            "constraints",
          ],
        },
      },
    });

    const questionData = JSON.parse(response.text!);

    res.status(200).json({
      success: true,
      data: questionData,
    });
  } catch (error) {
    console.error("Error generating coding question:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate question" });
  }
});
apiRouter.post("/chat/answer", async (req: Request, res: Response) => {
  const { question, solution } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an experienced AI coding tutor.

        You will be given:
        1. A JavaScript coding question with title, description, difficulty, and example inputs/outputs.
        2. The student's submitted solution.

        Your task:
        - Compare the student's solution with what the question is asking.
        - Explain clearly what is correct, what needs improvement, and why.
        - Suggest optimizations and alternative approaches.
        - Keep the tone encouraging and educational.
        - Return the output in **exactly** the JSON format given in the schema.
        - You do NOT need to list or invent constraints — leave that field empty if not provided.

        Question:
        ${question}

        Student's Solution:
        ${solution}
        `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            analysis: { type: Type.STRING },
            improvements: { type: Type.STRING },
          },
          propertyOrdering: [
            "title",
            "description",
            "difficulty",
            "analysis",
            "improvements",
          ],
        },
      },
    });

    let questionData;
    try {
      questionData = JSON.parse(response.text || "{}");
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      return res.status(500).json({
        success: false,
        error: "Invalid AI response format",
      });
    }

    res.status(200).json({
      success: true,
      data: questionData,
    });
  } catch (error) {
    console.error("Error generating coding feedback:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate feedback" });
  }
});

export default apiRouter;
