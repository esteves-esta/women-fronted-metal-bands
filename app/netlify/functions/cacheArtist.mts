import type { Config, Context } from "@netlify/functions";
import { cacheResponses } from "./utils/cacheDeezerResponse";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
  authAPI(req);

  const { artistId } = context.params;

  const result = await cacheResponses("artist", artistId);

  if (result.error)
    return Response.json(result.message || result.response, {
      status: result.status,
    });

  return Response.json(result.response);
};

export const config: Config = {
  path: "/deezer/artist/:artistId",
};
