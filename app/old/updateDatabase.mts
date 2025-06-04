import type { Config, Context } from "@netlify/functions";
import { authAPI } from "../netlify/functions/utils/auth";
import { loadData } from "./database";

export default async (req: Request, context: Context) => {
   const auth = authAPI(req);
   if (auth) {
     return Response.json(auth.message, {
       status: auth.status,
     });
   }


  const result = await loadData();
  // console.log(`Data updated with ${result.errorCount} errors.`);
  if (result.errorCount > 0) return Response.json("Error", { status: 500 });

  return Response.json("OK!! " + result.message);
};

export const config: Config = {
  path: "/api/update-database",
};
