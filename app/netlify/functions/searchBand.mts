import type { Config, Context } from "@netlify/functions";
import { createClient } from "redis";
import { createDatabase } from "./database";

// run by using yarn netlify dev

export default async (req: Request, context: Context) => {
  const { query } = context.params;
  // const { query, col, page, limit, sort, sortBy } = context.params;
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  // if (requestKey !== apiKey) {
  //   return Response.json("Sorry, no access for you.", { status: 401 });
  // }

  const client = await createDatabase();
  console.log(query);
  /* 
  https://app.netlify.com/
  https://app.redislabs.com/#/login
  https://redis.io/commands/ft.search/ 
  https://redis.io/docs/interact/search-and-query/query/
  */

  // switch (col) {
  //   case `allWomenBand`:
  // let result = await client.ft.search("idx:bands", `@allWomenBand:{true}`);
  //     break;

  //   default:
  // let result = await client.ft.search("idx:bands", query);
  //     break;
  // }

  let result = await client.ft.search("idx:bands", `@allWomenBand:{true}`);
  // let result = await client.ft.search("idx:bands", `@band:${query}`);
  // let result = await client.ft.search("idx:bands", `query @age:[30 40]`);

  client.quit();

  return Response.json(result);
};

export const config: Config = {
  path: "/search/:query",
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
