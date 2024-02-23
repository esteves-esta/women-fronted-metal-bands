import type { Config, Context } from "@netlify/functions";
import { authAPI } from "./auth";
import { connectCacheClient } from "./cacheDatabase";

export default async (req: Request, context: Context) => {
  // authAPI(req);
  const { artistId } = context.params;

  if (Number.isNaN(artistId)) {
    return Response.json("BAD REQUEST: artist id must be number !", {
      status: 400,
    });
  }
  let client;
  let cacheExist;
  try {
    client = await connectCacheClient();
    // cacheExist = await client.EXISTS(`artist:${artistId}`);
    cacheExist = await client.json.get(`artist:${artistId}`);
  } catch (e) {
    console.log("cliente " + e);
    return Response.json("Connection error.", { status: 500 });
  }

  if (cacheExist !== null) return Response.json(cacheExist);

  let responseResult;
  try {
    const response = await fetch(
      `https://women-fronted-metal-bands.netlify.app/api/artist/${artistId}`,
      {
        method: "GET",
      }
    );
    responseResult = await response.json();

    if (responseResult.error && responseResult.error?.code === 800)
      return Response.json(responseResult, {
        status: 500,
      });
  } catch (e) {
    console.log({ e });
    return Response.json(e, {
      status: 500,
    });
  }

  try {
    if (cacheExist == null)
      await client.json.set(`artist:${artistId}`, "$", responseResult);

    await client.quit();
  } catch (e) {
    console.log(`cache error: ${e}`);
  }

  return Response.json(responseResult);
};

export const config: Config = {
  path: "/deezer/artist/:artistId",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};
