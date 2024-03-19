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
  // let countries;
  let chartData: any[] = [
    { id: "1970", value: 0 },
    { id: "1980", value: 0 },
    { id: "1990", value: 0 },
    { id: "2000", value: 0 },
    { id: "2010", value: 0 },
    { id: "2020", value: 0 },
  ];

  const decadeBeginEnd = [
    [1979, 1970],
    [1989, 1980],
    [1999, 1990],
    [2009, 2000],
    [2019, 2010],
    [2029, 2020],
  ];

  try {
    // countries = await client.ft.aggregate("idx:bands", "*", {
    //   STEPS: [
    //     {
    //       type: AggregateSteps.GROUPBY,
    //       properties: ["@countryCode", "@country"],
    //       REDUCE: [
    //         {
    //           type: AggregateGroupByReducers.COUNT,
    //           AS: "count",
    //         },
    //       ],
    //     },
    //   ],
    // });

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

    // countries.results.forEach((result) => {
    //   chartData.push({
    //     id: result.countryCode,
    //     id2: result.country,
    //     data: [
    //       { x: "70s", y: 0 },
    //       { x: "80s", y: 0 },
    //       { x: "90s", y: 0 },
    //       { x: "00s", y: 0 },
    //       { x: "10s", y: 0 },
    //       { x: "20s", y: 0 },
    //     ],
    //   });
    // });

    responses.forEach((response, index) => {
      response.results.forEach((result) => {
        const { count } = result;
        chartData[index].value = Number(count);
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
  path: "/chart/years-active-in-each-decade",
};
