import { connectCacheClient } from "./cacheDatabase";
import { connectClient, formatYearsActive } from "./database";

export async function cacheResponses(
  endpoint: string,
  id: string,
  endpoint2?: string
) {
  if (Number.isNaN(id)) {
    return {
      error: true,
      status: 400,
      message: "BAD REQUEST: artist id must be number !",
      response: null,
    };
  }
  let clientUpstash;

  let cacheExist;

  try {
    clientUpstash = await connectCacheClient();
    // cacheExist = await client.EXISTS(`artist:${artistId}`);
    cacheExist = await clientUpstash.json.get(`${endpoint}:${id}`);
  } catch (e) {
    console.log("cliente " + e);

    return {
      error: false,
      status: 500,
      message: "Connection error.",
      response: null,
    };
  }

  if (cacheExist !== null)
    return {
      error: false,
      status: 200,
      message: null,
      response: cacheExist,
    };

  let responseResult;
  try {
    console.log({ endpoint2: endpoint2 === undefined });
    const endpointEnd =
      endpoint2 !== "null" && endpoint2 !== undefined ? `/${endpoint2}` : "";

    console.log(
      `https://women-fronted-metal-bands.netlify.app/api-deezer/${endpoint}/${id}${endpointEnd}`
    );
    const response = await fetch(
      `https://women-fronted-metal-bands.netlify.app/api-deezer/${endpoint}/${id}${endpointEnd}`,
      {
        method: "GET",
      }
    );
    console.log({ response });
    responseResult = await response.json();
    console.log({ responseResult });
    if (responseResult.error && responseResult.error?.code === 800)
      return {
        error: true,
        status: 500,
        message: "error",
        response: responseResult,
      };
  } catch (e) {
    console.log({ e });
    return {
      error: true,
      status: 500,
      message: "error",
      response: e,
    };
  }

  const DEEZER_EMPTY_PICTURE =
    "https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";

  const listJSON = require("../../../list-of-metal-bands/list.json");

  try {
    let clientBandDB;
    if (cacheExist == null) {
      await clientUpstash.json.set(`${endpoint}:${id}`, "$", responseResult);
      if (endpoint === "artist" && endpoint2 === "null") {
        const itemFound = listJSON.find((item) => item.deezerId === Number(id));
        if (itemFound) {
          clientBandDB = await connectClient();
          if (responseResult.picture_big === DEEZER_EMPTY_PICTURE)
            itemFound.emptyPicture = true;

          itemFound.deezerPicture = responseResult.picture_big;
          await clientBandDB.json.set(`band:${id}`, "$", {
            ...itemFound,
            activeFor: formatYearsActive(itemFound),
            numberOfVocalists: itemFound.currentVocalists.length,
          });
        }
        // {deezerTrackInfo;}
      }
    }
    await clientUpstash.quit();
    await clientBandDB.quit();
  } catch (e) {
    console.log(`cache error: ${e}`);
  }

  return {
    error: false,
    status: 200,
    message: null,
    response: responseResult,
  };
}
