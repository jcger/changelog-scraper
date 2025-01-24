export interface PromptFactory {
  ({
    previousChangelog,
    newChangelog,
  }: {
    previousChangelog: string;
    newChangelog: string;
  }): string;
}
