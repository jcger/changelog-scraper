import * as cheerio from "cheerio";
import { htmlToText } from "html-to-text";
import { HtmlToTextStrategy } from "./types";

export const convertToTextWithSelector: HtmlToTextStrategy = ({
  html,
  cardSelector,
}: {
  html: string;
  cardSelector?: string;
}) => {
  if (!cardSelector) {
    throw new Error(
      "cardSelector is required for 'convertToTextWithSelector' strategy"
    );
  }

  const $ = cheerio.load(html);
  let output = "";

  $(cardSelector)
    .slice(0, 6)
    .each((_, element) => {
      output += htmlToText($(element).html() || "") + "\n\n";
    });

  return output;
};
