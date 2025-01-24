import { changelogSources } from "./config/sources";
import { PromptFactory } from "./prompt_templates/types";
import { HtmlToTextStrategy } from "./html_to_text_strategies/types";
import { ScraperService } from "./scraper";

export class ChangelogMonitor {
  private scraper: ScraperService;

  constructor(scraper: ScraperService) {
    this.scraper = scraper;
  }

  async start({
    htmlToTextStrategy,
    promptFactory,
  }: {
    htmlToTextStrategy: HtmlToTextStrategy;
    promptFactory: PromptFactory;
  }): Promise<void> {
    for (const source of changelogSources) {
      try {
        const html = await this.scraper.run({ url: source.url });
        // TODO: Load from DB
        const previousChangelog = "";
        const newChangelog = htmlToTextStrategy({
          html,
          cardSelector: source.cardSelector,
        });
        const prompt = promptFactory({ previousChangelog, newChangelog });
        console.log(prompt);
      } catch (error) {
        console.error(
          `Error monitoring ${source.name}: ${(error as Error).message}`
        );
      }
    }
  }
}
