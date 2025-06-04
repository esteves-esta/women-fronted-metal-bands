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


    if (
      response.status !== 200 ||
      (responseResult.error && responseResult.error?.code === 800)
    ) {
      return {
        error: true,
        status: response.status,
        message: null,
        response: response,
      };
    }

    if (response.status === 200) { responseResult = await response.json(); }

    return {
      error: false,
      status: 200,
      message: null,
      response: responseResult,
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
}
