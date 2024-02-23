import { connectCacheClient } from "./cacheDatabase";

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
  let client;
  let cacheExist;
  try {
    client = await connectCacheClient();
    // cacheExist = await client.EXISTS(`artist:${artistId}`);
    cacheExist = await client.json.get(`${endpoint}:${id}`);
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
    const endpointEnd = endpoint2 ? `/${endpoint2}` : "";
    const response = await fetch(
      `https://women-fronted-metal-bands.netlify.app/api/${endpoint}/${id}${endpointEnd}`,
      {
        method: "GET",
      }
    );
    responseResult = await response.json();

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

  try {
    if (cacheExist == null)
      await client.json.set(`${endpoint}:${id}`, "$", responseResult);
    // await client.json.EXPIRE(`${endpoint}:${id}`, "14400 NX");

    await client.quit();
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
