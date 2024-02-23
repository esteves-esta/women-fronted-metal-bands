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

  return Response.json(chartData);
};

export const config: Config = {
  path: "/chart/years-active-by-country",
};
