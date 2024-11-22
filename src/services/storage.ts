import fs from "fs/promises";
import path from "path";
import { ChangelogEntry } from "../types/changelog";

export class StorageService {
  private dataPath: string;

  constructor() {
    // Store data in .data directory at project root
    this.dataPath = path.join(process.cwd(), ".data");
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataPath);
    } catch {
      await fs.mkdir(this.dataPath, { recursive: true });
    }
  }

  private getSourceFilePath(source: string): string {
    return path.join(
      this.dataPath,
      `${source.replace(/[^a-z0-9]/gi, "_")}.json`,
    );
  }

  private async readEntries(source: string): Promise<ChangelogEntry[]> {
    const filePath = this.getSourceFilePath(source);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async writeEntries(
    source: string,
    entries: ChangelogEntry[],
  ): Promise<void> {
    await this.ensureDataDirectory();
    const filePath = this.getSourceFilePath(source);
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2));
  }

  async saveEntry(entry: ChangelogEntry): Promise<void> {
    const entries = await this.readEntries(entry.source);

    // Check if entry already exists
    const existingIndex = entries.findIndex((e) => e.hash === entry.hash);
    if (existingIndex !== -1) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry); // Add new entry at the beginning
    }

    // Sort entries by date (newest first)
    entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    await this.writeEntries(entry.source, entries);
  }

  async getLatestEntryHash(source: string): Promise<string | null> {
    const entries = await this.readEntries(source);
    return entries[0]?.hash ?? null;
  }

  // Additional utility methods
  async getAllEntries(source: string): Promise<ChangelogEntry[]> {
    return this.readEntries(source);
  }

  async getStats(): Promise<{ [source: string]: number }> {
    const files = await fs.readdir(this.dataPath);
    const stats: { [source: string]: number } = {};

    for (const file of files) {
      if (file.endsWith(".json")) {
        const source = file.replace(".json", "");
        const entries = await this.readEntries(source);
        stats[source] = entries.length;
      }
    }

    return stats;
  }
}
