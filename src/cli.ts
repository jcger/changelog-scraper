import { Command } from "commander";
import { ChangelogMonitor } from "./changelog_monitor";
import { ScraperService } from "./scraper";
import { convertToTextWithSelector as withSelectorHtml2Text } from "./html_to_text_strategies/with_selector";
import { convertToText as simpleHtml2Text } from "./html_to_text_strategies/simple";
import { monitorPrompt } from "./prompt_templates/monitor";
import { comparePrompt } from "./prompt_templates/compare";

const program = new Command();
const monitor = new ChangelogMonitor(new ScraperService());

program
  .name("changelog-monitor")
  .description("Monitor changelog pages for updates")
  .version("1.0.0");

program
  .command("selector")
  .description("Start monitoring changelogs")
  .action(async () => {
    await monitor.start({
      htmlToTextStrategy: withSelectorHtml2Text,
      promptFactory: monitorPrompt,
    });
  });

program
  .command("compare")
  .description("compares the latest changelog with the previous one")
  .action(async () => {
    await monitor.start({
      htmlToTextStrategy: simpleHtml2Text,
      promptFactory: comparePrompt,
    });
  });

program.parse();
