import { Command } from "commander";
import { ChangelogMonitor } from "./index";
import {
  ScraperService,
  StorageService,
  NotificationService,
} from "./services";

const program = new Command();

const monitor = new ChangelogMonitor(
  new ScraperService(),
  new StorageService(),
  new NotificationService(),
);

program
  .name("changelog-monitor")
  .description("Monitor changelog pages for updates")
  .version("1.0.0");

program
  .command("start")
  .description("Start monitoring changelogs")
  .option("-i, --interval <minutes>", "Check interval in minutes", "60")
  .action(async (options) => {
    const interval = parseInt(options.interval) * 60 * 1000;

    while (true) {
      await monitor.monitor();
      await monitor.getStats();
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  });

program
  .command("stats")
  .description("Show current statistics")
  .action(async () => {
    await monitor.getStats();
  });

program.parse();
