import { ChangelogSource } from "../types/changelog";

export const changelogSources: ChangelogSource[] = [
  {
    name: "Jira Cloud",
    url: "https://developer.atlassian.com/cloud/jira/platform/changelog/",
    selector: ".changelog-entry",
    type: "html",
  },
  {
    name: "Jira Server",
    url: "https://developer.atlassian.com/server/jira/platform/changelog/",
    selector: ".changelog-entry",
    type: "html",
  },
];
