import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./utils/database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
   const auth = authAPI(req);
   if (auth) {
     return Response.json(auth.message, {
       status: auth.status,
     });
   }


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

  const beginEnd = [
    [0, 5],
    [5, 10],
    [10, 20],
    [20, 30],
    [30, 40],
    [40, 50],
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
      beginEnd.map((item) => {
        return client.ft.aggregate(
          "idx:bands",
          `@activeFor:[(${item[0]} (${item[1]}]`,
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

    countries.results.forEach((result) => {
      chartData.push({
        id: result.countryCode,
        id2: result.country,
        data: [
          { x: "1-5", y: 0 },
          { x: "5-10", y: 0 },
          { x: "10-20", y: 0 },
          { x: "20-30", y: 0 },
          { x: "30-40", y: 0 },
          { x: "40-50", y: 0 },
        ],
      });
    });

    responses.forEach((response, index) => {
      // console.log({ beginENd: beginEnd[index] });
      response.results.forEach((result) => {
        const { countryCode, count } = result;
        const countryIndex = chartData.findIndex(
          (item) => item.id === countryCode
        );

        if (countryIndex >= 0) {
          // console.log("oi", countryCode);
          chartData[countryIndex].data[index].y = Number(count);
        }

        //   console.log({
        //     countryIndex,
        //     countryCode,
        //     count,
        //     chartData: chartData[countryIndex].id,
        //     chartData2: chartData[countryIndex].data[index],
        //   });
      });
      // console.log("=============");
    });
  } catch (e) {
    console.log("error mine: " + e);
    return Response.json(`Error: ${e}`, { status: 500 });
  }

  client.quit();

  return Response.json(chartData);
};

export const config: Config = {
  path: "/chart/years-active-by-country",
};
