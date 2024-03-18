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
    cacheExist = await clientUpstash.json.get(`${endpoint}${endpoint2}:${id}`);
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
    // console.log({ mnode: process.env.MODE });
    // const URL = "https://women-fronted-metal-bands.netlify.app/deezerapi";
    const URL = "https://api.deezer.com";
    const endpointEnd =
      endpoint2 !== "null" && endpoint2 !== undefined ? `${endpoint2}` : "";

    const response = await fetch(
      `${URL}/${endpoint}/${Number(id)}${endpointEnd}`,
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      responseResult = await response.json();
    }
    if (
      response.status !== 200 ||
      (responseResult.error && responseResult.error?.code === 800)
    )
      return {
        error: true,
        status: response.status,
        message: null,
        response: response,
      };
  } catch (e) {
    // console.log({ json: e });
    return {
      error: true,
      status: 500,
      message: null,
      response: e,
    };
  }

  const DEEZER_EMPTY_PICTURE =
    "https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";

  const listJSON = require("../../../list-of-metal-bands/list.json");

  try {
    let clientBandDB;
    if (cacheExist == null) {
      await clientUpstash.json.set(
        `${endpoint}${endpoint2}:${id}`,
        "$",
        responseResult
      );
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
