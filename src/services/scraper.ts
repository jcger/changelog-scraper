import axios from "axios";
import * as cheerio from "cheerio";
import { createHash } from "crypto";
import { ChangelogEntry, ChangelogSource } from "../types/changelog";

export class ScraperService {
  async scrapeChangelog(source: ChangelogSource): Promise<ChangelogEntry[]> {
    const response = await axios.get(source.url);
    const $ = cheerio.load(response.data);
    const entries: ChangelogEntry[] = [];

    $(source.selector).each((_, element) => {
      const $element = $(element);
      const title = $element.find("h2, h3").first().text().trim();
      const content = $element.find("p").text().trim();
      const date = this.extractDate($element);

      const entry: ChangelogEntry = {
        date,
        title,
        content,
        source: source.name,
        url: source.url,
        hash: this.generateHash(title + content),
      };

      entries.push(entry);
    });

    return entries;
  }

  private extractDate(element: cheerio.Cheerio): Date {
    // Implement date extraction logic based on the specific changelog format
    const dateText = element.find(".date").text().trim();
    return new Date(dateText);
  }

  private generateHash(content: string): string {
    return createHash("md5").update(content).digest("hex");
  }
}
