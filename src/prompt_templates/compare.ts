import { PromptFactory } from "./types";

export const comparePrompt: PromptFactory = ({
  previousChangelog,
  newChangelog,
}) => {
  return `You are a changelog analyzer. Compare these two changelogs and focus only on critical changes that require developers to update their apis.
  For example a new version is coming or something is being deprecated.

previousChangelog:
${previousChangelog}

newChangelog:
${newChangelog}

Rules:
- Set needsAttention to true ONLY for:
  * Breaking changes
  * Removed features
  * Major version bumps
  * Security-related changes
  * Deprecated core functionality
- Ignore:
  * New optional features
  * Documentation changes
  * Minor improvements
  * Style changes

Analyze the changes and provide output in this JSON format:
{
    "needsAttention": boolean,
    "reason": string, // Brief explanation why attention is needed, or null if no attention needed
    "severity": "high" | "medium" | "low" | "none", // How urgent is the change
    "versionBump": "major" | "minor" | "patch" | "none" // What kind of version change is needed
}
`;
};
