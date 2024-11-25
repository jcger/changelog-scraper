export interface ChangelogSource {
  name: string;
  url: string;
  selector: string;
}

export const changelogSources: ChangelogSource[] = [
  // {
  //   name: "Jira Cloud",
  //   url: "https://developer.atlassian.com/cloud/jira/platform/changelog/",
  //   selector: "#changelogContentWrapperTop"
  // },
  {
    name: "Slack",
    url: "https://api.slack.com/changelog",
    selector: ".apiDocsLayout__gridMainContent",
  },
];
