import * as cheerio from "cheerio";
import { htmlToText } from "html-to-text";
import { HtmlToTextStrategy } from "./types";

export const convertToText: HtmlToTextStrategy = ({
  html,
}: {
  html: string;
}) => {
  const $ = cheerio.load(html);
  return htmlToText($("body").text());
};
