import fs from "fs/promises";
import path from "path";

export class Logger {
  private logPath: string;

  constructor() {
    this.logPath = path.join(process.cwd(), ".data", "logs");
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.access(this.logPath);
    } catch {
      await fs.mkdir(this.logPath, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const date = new Date().toISOString().split("T")[0];
    return `${date}.log`;
  }

  async log(
    message: string,
    level: "info" | "error" | "warn" = "info",
  ): Promise<void> {
    await this.ensureLogDirectory();
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    await fs.appendFile(
      path.join(this.logPath, this.getLogFileName()),
      logEntry,
    );
  }
}
