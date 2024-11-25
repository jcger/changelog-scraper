import { Command } from "commander";
import { ChangelogMonitor } from "./index";
import { ScraperService } from "./services";

const program = new Command();

const monitor = new ChangelogMonitor(new ScraperService());

program
  .name("changelog-monitor")
  .description("Monitor changelog pages for updates")
  .version("1.0.0");

program
  .command("start")
  .description("Start monitoring changelogs")
  .action(async () => {
    await monitor.monitor();
  });

program.parse();
