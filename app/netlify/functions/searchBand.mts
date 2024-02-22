import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";
import { AggregateSteps } from "@redis/search";

// run by using yarn netlify dev

export default async (req: Request, context: Context) => {
  // console.log(context);
  console.log(context.params);
  const { query, col, page, limit, sort, sortBy, filter } = context.params;
  /* 
search
- band
- vocalists
- country
- active for - ft.AGGREGATE  - index "*" APPLY "@yearEnded - @yearStarted" AS active 


- years active @price:[270 270]

ex: (@band:${query}) (@${allWomenBand}:{true})

filter
- active "yearEnded" = null
- disbanded "yearEnded" != null
 - allwomen    `@${allWomenBand}:{true}`;
 - blackwomen    `@${blackWomen}:{true}`;
 - sister    `@${blackWomen}:{true}`;
-
*/

  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  // if (requestKey !== apiKey) {
  //   return Response.json("Sorry, no access for you.", { status: 401 });
  // }

  const client = await connectClient();
  console.log("oi");
  /* 
  https://app.netlify.com/
  https://app.redislabs.com/#/login
  https://redis.io/commands/ft.search/ 
  https://redis.io/docs/interact/search-and-query/query/
  */

  const searchCols = [
    "band",
    "country",
    "vocalists",
    "active-for",
    "yearStarted",
    "yearEnded",
  ];

  let searchQuery = "";
  // let type = "search";
  if (query === "null") searchQuery = `*`;
  else {
    if (col === "null") searchQuery = `*${query}*`;
    else if (searchCols.includes(col)) {
      searchQuery = `@${col}:*${query}*`;
      // if (col === "n-vocalists") {
      //   searchQuery = `$..currentVocalists`;
      // }
      if (col === "vocalists") {
        searchQuery = `(@currentVocalists:*${query}*) (@pastVocalists:*${query}*)`;
      }
      if (col === "active-for") {
        // negation
        // searchQuery = `-@yearEnded:[0 0]`;
        
        // ended
        // searchQuery = `@yearEnded:[1 +inf]`;

        // active
        // searchQuery = `@yearEnded:[0 0]`;

        // searchQuery = `*`;
        // type = "aggregate";
        // FT.AGGREGATE idx:bicycle "*" LOAD 1 price APPLY "@price<1000" AS price_category GROUPBY 1 @condition REDUCE SUM 1 "@price_category" AS "num_affordable"
        // searchQuery = `* APPLY @yearEnded - @yearStarted AS active`;
        // searchQuery = `* APPLY @yearEnded - @yearStarted AS active @active:[${query} ${query}]`;

        // const result2 = await client.ft.aggregate("idx:users", "*", {
        //   STEPS: [
        //     {
        //       type: AggregateSteps.APPLY,
        //       expression: "@yearStarted < 2000",
        //       AS: "active",
        //     },
        //   ],
        // });
        // return Response.json(result2);
      }
    }
  }

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

  const filterCols = [
    "active",
    "disbanded",
    "allwomen",
    "blackwomen",
    "sister",
  ];
  if (filterCols.includes(filter)) {
    if (["allwomen", "blackwomen", "sister"].includes(filter)) {
      searchQuery += ` @${filter}:{true}`;
    }
  }

  /* SORT AND LIMIT */
  const sortType = ["ASC", "DESC"];
  // https://github.com/redis/node-redis/issues/2334
  let searchOption: { LIMIT?: any; SORTBY?: any } = {};
  if (sortBy !== "null" && sortType.includes(sort.toUpperCase())) {
    searchOption.SORTBY = { BY: sortBy, DIRECTION: sort };
  }

  if (page !== "null" && limit !== "null") {
    searchOption.LIMIT = {
      from: Number(page),
      size: Number(limit),
    };
  }

  /* DATABASE FULL TEXT SEARCH */
  console.log({ searchQuery });
  console.log({ searchOption });
  console.log({ searchOptions: Object.keys(searchOption).length > 0 });
  let result;
  if (Object.keys(searchOption).length > 0)
    result = await client.ft.search("idx:bands", searchQuery, searchOption);
  else result = await client.ft.search("idx:bands", searchQuery);

  client.quit();

  console.log({ result: result.documents.length });
  return Response.json(result);
};

// result = await client.ft.search("idx:bands", `@allWomenBand:{true}`);
// let result = await client.ft.search("idx:bands", `query @age:[30 40]`);

export const config: Config = {
  path: "/search/:query/:col/:page/:limit/:sort/:sortBy/:filter",
  // https://teste--women-fronted-metal-bands.netlify.app/hello
};

// https://dev.to/myogeshchavan97/using-serverless-redis-as-database-for-netlify-functions-2mii
/* 
https://redis.io/docs/connect/clients/nodejs/
https://docs.netlify.com/functions/get-started/#write-a-function
*/

/* 
https://github.com/redis/node-redis/blob/master/packages/search/README.md
https://github.com/redis/node-redis/blob/master/examples/managing-json.js
https://redis.io/docs/connect/clients/nodejs/


https://github.com/redis/node-redis/blob/master/examples/search-json.js
https://redis.io/commands/ft.create/#description
https://github.com/RediSearch/RediSearch/issues/2293#issuecomment-941987561
https://learn.redis.com/kb/doc/2dhiyayzpm/how-to-model-a-boolean-at-index-creation-time
https://redis.io/docs/interact/search-and-query/indexing/
*/
