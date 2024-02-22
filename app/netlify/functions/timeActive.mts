import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  const client = await connectClient();

  let responses;
  let chartData = [
    { id: "1", value: 0 },
    { id: "2", value: 0 },
    { id: "3", value: 0 },
    { id: "4", value: 0 },
    { id: "5-10", value: 0 },
    { id: "10-20", value: 0 },
    { id: "20-30", value: 0 },
    { id: "30-40", value: 0 },
    { id: "40-50", value: 0 },
  ];
  try {
    /* 
 FT.AGGREGATE idx:bands "@yearStarted:[0 1989] -@yearEnded:[1 1980]" GROUPBY 0 REDUCE COUNT 0 as count

   FT.AGGREGATE idx:bands "*" GROUPBY 0 REDUCE AVG 1 @activeFor as active
   */

    const beginEnd = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [5, 10],
      [10, 20],
      [20, 30],
      [30, 40],
      [40, 50],
    ];
    responses = await Promise.all(
      beginEnd.map((item) => {
        return client.ft.aggregate(
          "idx:bands",
          `@activeFor:[${item[0]} ${item[1]}]`,
          {
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
          }
        );
      })
    );

    //https://github.com/redislabs-training/node-js-crash-course/blob/main/src/utils/dataloader.js

    responses.forEach((response, index) => {
      chartData[index].value = response.results[0].count;
    });
  } catch (e) {
    console.log("error mine: " + e);
  }

  client.quit();

  // console.log({ result: result.total });
  return Response.json(chartData);
};

export const config: Config = {
  path: "/time-active",
};


/* 
get countris => > FT.AGGREGATE idx:bands "*" GROUPBY 1 @countryCode

- populate each data point 

How long these bands are active - by country
> FT.AGGREGATE idx:bands "@activeFor:[0 4]" GROUPBY 1 @countryCode REDUCE COUNT 0 as count
 */
