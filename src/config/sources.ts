export type ChangelogSelectors = string;

export interface ChangelogSource {
  name: string;
  key: string;
  url: string;
  cardSelector?: ChangelogSelectors;
}

export const changelogSources: ChangelogSource[] = [
  {
    name: "FakeService",
    key: "fakeservice",
    url: "https://www.fakeeservice.com/",
  },
];
