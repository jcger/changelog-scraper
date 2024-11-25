import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import { ChangelogSource } from "../config/sources";
import path from "path";
import fs from "fs/promises";
// import { createHash } from "crypto";

export interface ChangelogEntry {
  date: Date;
  title: string;
  titleDate: Date;
  isDeprecation: boolean;
  link: string;
  hash: string; // To track if we've seen this entry before
}

const PLACEHOLDER = "___HTML___";
export class ScraperService {
  private prompt = `Given this html ${PLACEHOLDER}, return a json with `;
  private cleanHtml({ html, selector }: { html: string; selector: string }) {
    console.log({ html: html.slice(0, 100) });
    const $ = cheerio.load(html);

    $("script").remove();
    $("svg").remove();
    $("style").remove();
    $('link[rel="stylesheet"]').remove();
    $("*").removeAttr("style");

    const selectorName = selector.slice(1, selector.length);
    $("*").each((_, element) => {
      const attributes = $(element).attr();
      for (const attr in attributes) {
        if (
          attr === "class" &&
          !$(element).attr("class")?.includes(selectorName)
        ) {
          $(element).removeAttr(attr);
        }
        if (attr !== "href" && attr !== "id" && attr !== "class") {
          $(element).removeAttr(attr);
        }
      }
    });

    return $(selector).html();
  }

  private async format({ html }: { html: string }) {
    // create prompt that formats the html into a json that looks like:
    // {entryDate, type, title, link}
    const {
      OPENAI_API_KEY: apiKey,
      OPENAI_MODEL: model = "gpt-4o",
      OPENAI_TEMPERATURE: temperature = 0.2,
    } = process.env;

    if (!apiKey) {
      console.error("Missing env variable: OPENAI_API_KEY");
      process.exit(1);
    }

    const openai = new OpenAI({
      apiKey,
    });

    const prompt = "";

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model,
      });

      return completion.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("Error calling ChatGPT:", error);
      throw error;
    }
  }

  private async fetchChangelog({ source }: { source: ChangelogSource }) {
    // const html = (await axios.get(source.url)).data;
    try {
      const filePath = path.join(
        process.cwd(),
        "responses",
        "slack-changelog.html",
      );
      // await fs.writeFile(filePath, html);
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.error("Error loading changelog content:", error);
      throw error;
    }
  }

  // private generateHash({ html }: { html: string }): string {
  //   return createHash("md5").update(html).digest("hex");
  // }

  public async run(source: ChangelogSource) {
    const html = await this.fetchChangelog({ source });
    // console.log({ html });
    const cleanHtml = this.cleanHtml({ html, selector: source.selector });
    console.log({ cleanHtml });
    // const data = this.format({ html: cleanHtml });
    // console.log({ data });
  }
}
