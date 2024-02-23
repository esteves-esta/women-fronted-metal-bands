import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  const client = await connectClient();

  let responses;
  let chartData = [
    { id: "1970", value: 0 },
    { id: "1980", value: 0 },
    { id: "1990", value: 0 },
    { id: "2000", value: 0 },
    { id: "2010", value: 0 },
    { id: "2020", value: 0 },
  ];
  try {
    /* 
  same as  ==> FT.AGGREGATE idx:bands "*" GROUPBY 2 @countryCode @country REDUCE COUNT 0 as count
   */

    const decadeBeginEnd = [
      [1979, 1970],
      [1989, 1980],
      [1999, 1990],
      [2009, 2000],
      [2019, 2010],
      [2029, 2020],
    ];
    responses = await Promise.all(
      decadeBeginEnd.map((item) => {
        return client.ft.aggregate(
          "idx:bands",
          `@yearStarted:[0 ${item[0]}] -@yearEnded:[1 ${item[1]}]`,
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
  path: "/chart/count-on-decade",
};
