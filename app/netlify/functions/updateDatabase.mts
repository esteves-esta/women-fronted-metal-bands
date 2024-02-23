import type { Config, Context } from "@netlify/functions";
import { authAPI } from "./auth";
import { loadData } from "./database";

export default async (req: Request, context: Context) => {
  authAPI(req);

  const result = await loadData();
  // console.log(`Data updated with ${result.errorCount} errors.`);
  if (result.errorCount > 0) return Response.json("Error", { status: 500 });

  return Response.json("OK!! " + result.message);
};

export const config: Config = {
  path: "/update-database",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};
