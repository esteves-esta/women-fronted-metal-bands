import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./utils/database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
  authAPI(req);

  let client;

  try {
    client = await connectClient();
  } catch (e) {
    console.log("cliente " + e);
    return Response.json("Connection error.", { status: 500 });
  }

  let responses;
  const allwomenData = [
    { id: "all women", value: 0 },
    { id: "mixed", value: 0 },
  ];
  const blackwomenData = [
    { id: "other", value: 0 },
    { id: "black women", value: 0 },
  ];
  const sisterData = [
    { id: "yes", value: 0 },
    { id: "no", value: 0 },
  ];

  const statusData = [
    { id: "active", value: 0 },
    { id: "disbanded", value: 0 },
  ];

  const queries = [
    `@allWomenBand:{true}`,
    `@allWomenBand:{false}`,

    `@blackWomen:{true}`,
    `@blackWomen:{false}`,

    `@sister:{true}`,
    `@sister:{false}`,

    `@yearEnded:[0 0]`,
    `@yearEnded:[1 +inf]`,
  ];

  try {
    responses = await Promise.all(
      queries.map((query) =>
        client.ft.aggregate("idx:bands", query, {
          STEPS: [
            {
              type: AggregateSteps.GROUPBY,
              properties: [],
              REDUCE: [
                {
                  type: AggregateGroupByReducers.COUNT,
                  AS: "count",
                },
              ],
            },
          ],
        })
      )
    );

    //https://github.com/redislabs-training/node-js-crash-course/blob/main/src/utils/dataloader.js
    responses.forEach((response, index) => {
      switch (index) {
        case 0:
          allwomenData[0].value = response.results[0].count;
          break;
        case 1:
          allwomenData[1].value = response.results[0].count;
          break;

        case 2:
          blackwomenData[0].value = response.results[0].count;
          break;
        case 3:
          blackwomenData[1].value = response.results[0].count;
          break;

        case 4:
          sisterData[0].value = response.results[0].count;
          break;
        case 5:
          sisterData[1].value = response.results[0].count;
          break;

        case 6:
          statusData[0].value = response.results[0].count;
          break;
        case 7:
          statusData[1].value = response.results[0].count;
          break;

        default:
          break;
      }
    });
  } catch (e) {
    console.log("error mine: " + e);
    return Response.json(`Error: ${e}`, { status: 500 });
  }

  client.quit();

  return Response.json({
    allwomenData,
    blackwomenData,
    sisterData,
    statusData,
  });
};

export const config: Config = {
  path: "/chart/details",
};
