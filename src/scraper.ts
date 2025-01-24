export class ScraperService {
  public async run({ url }: { url: string }) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch changelog from ${url}: ${response.statusText}`
      );
    }

    return await response.text();
  }
}
