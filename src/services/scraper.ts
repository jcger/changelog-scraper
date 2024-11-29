import axios from "axios";
import * as cheerio from "cheerio";
import { ChangelogSelectors, ChangelogSource } from "../config/sources";
import path from "path";
import fs from "fs/promises";
import { htmlToText } from "html-to-text";

export interface ChangelogEntry {
  date: Date;
  title: string;
  titleDate: Date;
  isDeprecation: boolean;
  link: string;
  hash: string; // To track if we've seen this entry before
}

export class ScraperService {
  private generatePrompt = ({ changelog }: { changelog: string }) => {
    return `You are a changelog parser. Your only task is to convert the provided changelog into the following JSON format:

{
  "changes": [
    {
      "date": "anouncement date in DD-MM-YYYY format"
      "type": "added|changed|fixed|removed|deprecated|unknown",
      "description": "string",
    }
  ]
}

Rules:
1. Only parse the actual changelog content
2. Classify each change into one of the predefined types
3. Keep descriptions concise but preserve the original meaning
4. If change type is unclear, default to "unknown"
5. Remove any HTML formatting from descriptions

Here is the changelog:
${changelog}`;
  };

  private convertToText({
    html,
    cardSelector,
  }: {
    html: string;
    cardSelector: ChangelogSelectors;
  }) {
    const $ = cheerio.load(html);

    let output = "";
    $(cardSelector)
      .slice(0, 6)
      .each((_, element) => {
        output += htmlToText($(element).html() || "") + "\n\n";
      });

    return output;
  }

  private async aiFormatter({ prompt }: { prompt: string }) {
    const {
      GOOGLE_API_KEY: apiKey = process.env.GEMINI_API_KEY,
      GOOGLE_MODEL: model = "gemini-1.5-flash",
      GOOGLE_TEMPERATURE: temperature = 0.5,
    } = process.env;

    if (!apiKey) {
      console.error("Missing env variable: GOOGLE_API_KEY");
      process.exit(1);
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      const generativeModel = genAI.getGenerativeModel({ model });

      const result = await generativeModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
        },
      });

      const response = await result.response;
      return response.text() || "No response";
    } catch (error) {
      console.error("Error calling Google Generative AI:", error);
      throw error;
    }
  }

  private async fetchChangelog({ source }: { source: ChangelogSource }) {
    // const html = (await axios.get(source.url)).data;
    try {
      const filePath = path.join(
        process.cwd(),
        ".tmp",
        "responses",
        // "slack-changelog.html",
        "jira-changelog.html",
      );
      // await fs.writeFile(filePath, html);
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.error("Error loading changelog content:", error);
      throw error;
    }
  }

  public async run(source: ChangelogSource) {
    const html = await this.fetchChangelog({ source });
    const changelogAsText = this.convertToText({
      html,
      cardSelector: source.cardSelector,
    });
    await fs.writeFile(
      path.join(process.cwd(), ".tmp", "clean.txt"),
      changelogAsText,
    );
    // console.log({ changelogAsText });
    if (!changelogAsText) {
      throw new Error(`No HTML scrapped for ${source.url}`);
    }
    const prompt = this.generatePrompt({ changelog: changelogAsText });
    await fs.writeFile(path.join(process.cwd(), ".tmp", "prompt.txt"), prompt);
    const data = await this.aiFormatter({ prompt });

    await fs.writeFile(path.join(process.cwd(), ".tmp", "output.txt"), data);
    // console.log(data);

    const evaluationPrompt = `Score from 0 to 10 the output of this prompt ${prompt}. The output is ${data}`;

    await fs.writeFile(
      path.join(process.cwd(), ".tmp", "evaluationPrompt.txt"),
      evaluationPrompt,
    );
  }
}
