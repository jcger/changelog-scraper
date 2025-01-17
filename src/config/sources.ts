export type ChangelogSelectors = string;

export interface ChangelogSource {
  name: string;
  key: string;
  url: string;
  cardSelector: ChangelogSelectors;
}

export const changelogSources: ChangelogSource[] = [
  {
    name: "Fake API",
    key: "fake_api",
    url: "https://fake-api.com/changelog",
    cardSelector:
      "#changelogContentWrapperTop > div:nth-child(2) > div:nth-child(1) > div",
  },
];
