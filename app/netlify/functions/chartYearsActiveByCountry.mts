import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";

// TODO

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  const client = await connectClient();

  let responses;
  let chartData = [
    {
      id: "countrycode",
      data: [
        { id: "1-5", value: 0 },
        { id: "5-10", value: 0 },
        { id: "10-20", value: 0 },
        { id: "20-30", value: 0 },
        { id: "30-40", value: 0 },
        { id: "40-50", value: 0 },
      ],
    },
  ];

  /* 
get countris => > FT.AGGREGATE idx:bands "*" GROUPBY 1 @countryCode

- populate each data point 

How long these bands are active - by country
> FT.AGGREGATE idx:bands "@activeFor:[0 4]" GROUPBY 1 @countryCode REDUCE COUNT 0 as count
 */

  try {
    const beginEnd = [
      [0, 5],
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

    // responses.forEach((response, index) => {
    //   chartData[index].value = response.results[0].count;
    // });
  } catch (e) {
    console.log("error mine: " + e);
  }

  client.quit();

  return Response.json(responses);
};

export const config: Config = {
  path: "/chart/years-active-by-country",
};
