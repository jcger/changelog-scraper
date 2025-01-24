import { PromptFactory } from "./types";

export const monitorPrompt: PromptFactory = ({
  previousChangelog,
  newChangelog,
}) => {
  return `You are a changelog parser. Your only task is to convert the provided changelog into the following JSON format:

{
  "changes": [
    {
      "date": "anouncement date in DD-MM-YYYY format"
      "type": "added|changed|fixed|removed|deprecated|unknown",
      "description": "string",
    }
  ]
}

Rules:
1. Only parse the actual changelog content
2. Classify each change into one of the predefined types
3. Keep descriptions concise but preserve the original meaning
4. If change type is unclear, default to "unknown"
5. Remove any HTML formatting from descriptions

Here is the changelog:
${newChangelog}

Ignore issues already mentioned in previousChangelog:
${previousChangelog}
`;
};
