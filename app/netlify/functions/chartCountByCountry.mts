import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateGroupByReducers, AggregateSteps } from "redis";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  console.log(context.params);
  const { filter, growling } = context.params;

  const client = await connectClient();

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
  } else {
    filters = "";
  }

  if (growling !== "null" && !Number.isNaN(growling)) {
    filters += ` @growling:[${growling} ${growling}]`;
  }

  /* 
todo
> FT.AGGREGATE idx:bands "*" GROUPBY 0 REDUCE AVG 1 @activeFor as active
*/

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
  }

  client.quit();

  console.log({ result: result.total });
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
