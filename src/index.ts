import { changelogSources } from "./config/sources";
import { ScraperService } from "./services/scraper";
import { Logger } from "./logger";

export class ChangelogMonitor {
  private logger: Logger;

  constructor(private scraper: ScraperService) {
    this.logger = new Logger();
  }

  async monitor(): Promise<void> {
    for (const source of changelogSources) {
      try {
        await this.logger.log(`Checking ${source.name} changelog...`);

        const entries = await this.scraper.run(source);
      } catch (error) {
        await this.logger.log(
          `Error monitoring ${source.name}: ${(error as Error).message}`,
          "error",
        );
      }
    }
  }
}
