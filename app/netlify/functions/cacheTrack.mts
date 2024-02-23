import type { Config, Context } from "@netlify/functions";
import { cacheResponses } from "./cacheDeezerResponse";
import { authAPI } from "./auth";

export default async (req: Request, context: Context) => {
  authAPI(req);

  const { trackId } = context.params;

  const result = await cacheResponses("track", trackId);

  if (result.error)
    return Response.json(result.message || result.response, {
      status: result.status,
    });

  return Response.json(result.response);
};

export const config: Config = {
  path: "/deezer/track/:trackId",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};
