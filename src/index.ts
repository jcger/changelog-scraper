import { changelogSources } from "./config/sources";
import { ScraperService } from "./services/scraper";

export class ChangelogMonitor {
  constructor(private scraper: ScraperService) {}

  async monitor(): Promise<void> {
    for (const source of changelogSources) {
      try {
        const entries = await this.scraper.run(source);
      } catch (error) {
        console.log(
          `Error monitoring ${source.name}: ${(error as Error).message}`,
        );
      }
    }
  }
}
