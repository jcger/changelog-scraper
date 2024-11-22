export interface ChangelogEntry {
  date: Date;
  title: string;
  content: string;
  source: string;
  url: string;
  hash: string; // To track if we've seen this entry before
}

export interface ChangelogSource {
  name: string;
  url: string;
  selector: string; // CSS selector to find changelog entries
  type: 'html' | 'api';
}
