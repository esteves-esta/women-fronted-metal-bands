import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";
import { authAPI } from "./auth";

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
  let countries;
  let chartData: any[] = [];

  /* 
get countris => > FT.AGGREGATE idx:bands "*" GROUPBY 1 @countryCode

- populate each data point 

How long these bands are active - by country
> FT.AGGREGATE idx:bands "@activeFor:[0 4]" GROUPBY 1 @countryCode REDUCE COUNT 0 as count
 */

  const decadeBeginEnd = [
    [1979, 1970],
    [1989, 1980],
    [1999, 1990],
    [2009, 2000],
    [2019, 2010],
    [2029, 2020],
  ];

  try {
    countries = await client.ft.aggregate("idx:bands", "*", {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ["@countryCode", "@country"],
          REDUCE: [
            {
              type: AggregateGroupByReducers.COUNT,
              AS: "count",
            },
          ],
        },
      ],
    });

    responses = await Promise.all(
      decadeBeginEnd.map((item) => {
        return client.ft.aggregate(
          "idx:bands",
          `@yearStarted:[0 ${item[0]}] -@yearEnded:[1 ${item[1]}]`,
          {
            STEPS: [
              {
                type: AggregateSteps.GROUPBY,
                properties: ["@countryCode"],
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

    countries.results.forEach((result) => {
      chartData.push({
        id: result.countryCode,
        id2: result.country,
        data: [
          { x: "70s", y: 0 },
          { x: "80s", y: 0 },
          { x: "90s", y: 0 },
          { x: "00s", y: 0 },
          { x: "10s", y: 0 },
          { x: "20s", y: 0 },
        ],
      });
    });

    responses.forEach((response, index) => {
      response.results.forEach((result) => {
        const { countryCode, count } = result;
        const countryIndex = chartData.findIndex(
          (item) => item.id === countryCode
        );

        if (countryIndex > 0)
          chartData[countryIndex].data[index].y = Number(count);
      });
    });
  } catch (e) {
    console.log("error mine: " + e);
    return Response.json(`Error: ${e}`, { status: 500 });
  }

  client.quit();

  return Response.json(chartData);
};

export const config: Config = {
  path: "/chart/active-by-each-decade",
};
