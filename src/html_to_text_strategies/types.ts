export interface HtmlToTextStrategy {
  ({ html, cardSelector }: { html: string; cardSelector?: string }): string;
}
