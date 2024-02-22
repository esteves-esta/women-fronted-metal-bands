import type { Config, Context } from "@netlify/functions";
import { loadData } from "./database";

// run by using
// --yarn netlify dev
// http://localhost:8888/search/baby/null/1/10/asc/band
export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  // if (requestKey !== apiKey) {
  //   return Response.json("Sorry, no access for you.", { status: 401 });
  // }

  const result = await loadData();
  console.log(`Data updated with ${result.errorCount} errors.`);
  return Response.json("OK!! " + result.message);
};

export const config: Config = {
  path: "/update-database",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};
