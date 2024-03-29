import type { Config, Context } from "@netlify/functions";
import { cacheResponses } from "./utils/cacheDeezerResponse";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
   const auth = authAPI(req);
   if (auth) {
     return Response.json(auth.message, {
       status: auth.status,
     });
   }


  const { trackId } = context.params;

  const result = await cacheResponses("track", trackId, "null");
  
  if (result.error)
    return Response.json(result.message || result.response, {
      status: result.status,
    });

  return Response.json(result.response);
};

export const config: Config = {
  path: "/api/deezer/track/:trackId",
};
