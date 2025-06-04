import type { Config, Context } from "@netlify/functions";
import listJSON from "../list-of-metal-bands/list.json";
import { authAPI } from "../netlify/functions/utils/auth";

export default async (req: Request, context: Context) => {
  const listJSON = require("../../list-of-metal-bands/list.json");

  const auth = authAPI(req);
  if (auth) {
    return Response.json(auth.message, {
      status: auth.status,
    });
  }

  const bandNames: string[] = [];
  listJSON.forEach((item) => {
    const names = item.band.split(" ");
    names.forEach((w) => {
      bandNames.push(w.toLowerCase());
    });
  });
  /* https://codesandbox.io/p/sandbox/github/airbnb/visx/tree/master/packages/visx-demo/src/sandboxes/visx-wordcloud?file=%2FExample.tsx%3A19%2C1-29%2C2 */
  function wordFreq(text: string) {
    const words: string[] = text.replace(/\./g, "").split(/\s/);
    const freqMap: Record<string, number> = {};

    for (const w of words) {
      if (!freqMap[w]) freqMap[w] = 0;
      freqMap[w] += 1;
    }
    return Object.keys(freqMap).map((word) => ({
      text: word,
      value: freqMap[word],
    }));
  }
  const words = wordFreq(bandNames.join(" "));

  return Response.json(words.filter((item) => item.value > 1 && item.text));
};

export const config: Config = {
  path: "/chart/common-words",
};
