import type { Config, Context } from "@netlify/functions";
import { loadData } from "./database";

// run by using 
// --yarn netlify dev

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  if (requestKey !== apiKey) {
    return Response.json("Sorry, no access for you.", { status: 401 });
  }

  await loadData();

  return Response.json("Database updated !! ");
};

export const config: Config = {
  path: "/update-database",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};
