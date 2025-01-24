import path from "path";
import fs from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GoogleGemini {
  private async send({ prompt }: { prompt: string }) {
    const {
      GOOGLE_API_KEY: apiKey = process.env.GEMINI_API_KEY,
      GOOGLE_MODEL: model = "gemini-1.5-flash",
      GOOGLE_TEMPERATURE: tempString = "0.5",
    } = process.env;

    const temperature = Number(tempString);

    if (!apiKey) {
      console.error("Missing env variable: GOOGLE_API_KEY");
      process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      const generativeModel = genAI.getGenerativeModel({ model });

      const { response } = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
        },
      });

      return response.text() || "No response";
    } catch (error) {
      console.error("Error calling Google Generative AI:", error);
      throw error;
    }
  }

  public async run({ prompt }: { prompt: string }) {
    const data = await this.send({ prompt });

    const evaluationPrompt = `Score from 0 to 10 the output of this prompt ${prompt}. The output is ${data}`;

    await fs.writeFile(
      path.join(process.cwd(), ".tmp", "evaluationPrompt.txt"),
      evaluationPrompt
    );
  }
}
