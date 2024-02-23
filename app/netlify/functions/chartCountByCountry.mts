import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./utils/database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
  authAPI(req);

  // console.log(context.params);
  const { filter, growling } = context.params;

  let client;

  try {
    client = await connectClient();
  } catch (e) {
    console.log("cliente " + e);
    return Response.json("Connection error.", { status: 500 });
  }

  let filters = "*";
  const filterCols = [
    "active",
    "disbanded",
    "allWomenBand",
    "mixedGender",
    "blackWomen",
    "sister",
  ];

  if (filter !== "null" && filterCols.includes(filter)) {
    switch (filter) {
      case "active":
        filters = `@yearEnded:[0 0]`;
        break;
      case "disbanded":
        filters = `@yearEnded:[1 +inf]`;
        break;
      case "mixedGender":
        filters = `@allWomenBand:{false}`;
        break;
      default:
        filters = `@${filter}:{true}`;
        break;
    }
  }

  if (growling !== "null" && !Number.isNaN(growling)) {
    if (filters.includes("*")) filters = "";
    filters += ` @growling:[${growling} ${growling}]`;
  }

  let result;
  try {
    /* 
  same as  ==> FT.AGGREGATE idx:bands "*" GROUPBY 2 @countryCode @country REDUCE COUNT 0 as count
   */
    console.log(filters);

    result = await client.ft.aggregate("idx:bands", filters, {
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
  } catch (e) {
    console.log("error mine: " + e);
    return Response.json(`Error: ${e}`, { status: 500 });
  }

  client.quit();
  // console.log({ filters });
  // console.log({ result: result.total });
  return Response.json(result);
};

export const config: Config = {
  path: "/chart/count-by-country/:filter/:growling",
};

// TO LIST
// const result = await client.ft.aggregate("idx:bands", "*", {
//   STEPS: [
//     {
//       type: AggregateSteps.GROUPBY,
//       properties: ["@countryCode"],
//       REDUCE: [
//         {
//           type: AggregateGroupByReducers.TOLIST,
//           property: "@country",
//           AS: "country",
//         },
//       ],
//     },
//   ],
// });

// https://stackoverflow.com/questions/77719346/redis-aggregation-using-nodejs
// https://stackoverflow.com/questions/75876245/how-to-use-ft-aggregate-in-node-redis
//  https://github.com/redis/node-redis/issues/2282
// https://stackoverflow.com/questions/75876245/how-to-use-ft-aggregate-in-node-redis
// COUNT

// {
//         STEPS: [
//           {
//             type: AggregateSteps.GROUPBY,
//             REDUCE: [
//               {
//                 type: AggregateGroupByReducers.AVG,
//                 property: "age",
//                 AS: "averageAge",
//               },
//               {
//                 type: AggregateGroupByReducers.SUM,
//                 property: "coins",
//                 AS: "totalCoins",
//               },
//             ],
//           },
//         ],
//       }
