import type { Config, Context } from "@netlify/functions";
import { cacheResponses } from "./functions/utils/cacheDeezerResponse";
// import { authAPI } from "./functions/utils/auth";

export default async (req: Request, context: Context) => {
  // const auth = authAPI(req);
  // if (auth) {
  //   return Response.json(auth.message, {
  //     status: auth.status,
  //   });
  // }
  console.log({ context })
  const { artistId, top } = context.params;
  let enpdoint2 = `null`;

  if (top !== "null") {
    enpdoint2 = `/top?index=0&limit=1`;
  }
  const result = await cacheResponses("artist", artistId, enpdoint2);
  console.log({ result })
  if (result.error)
    return Response.json(result.message || result.response, {
      status: result.status,
    });

  return Response.json(result.response);
};

export const config: Config = {
  path: "/api/deezer/artist/:artistId/:top",
};
