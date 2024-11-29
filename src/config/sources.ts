export type ChangelogSelectors = string;

export interface ChangelogSource {
  name: string;
  key: string;
  url: string;
  cardSelector: ChangelogSelectors;
}

export const changelogSources: ChangelogSource[] = [
  {
    name: "Jira Cloud",
    key: "jira_cloud",
    url: "https://developer.atlassian.com/cloud/jira/platform/changelog/",
    cardSelector:
      "#changelogContentWrapperTop > div:nth-child(2) > div:nth-child(1) > div",
  },
  {
    name: "Slack",
    key: "slack",
    url: "https://api.slack.com/changelog",
    cardSelector: ".apiChangelog__group",
  },
];
