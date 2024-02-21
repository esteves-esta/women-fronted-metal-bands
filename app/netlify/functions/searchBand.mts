import type { Config, Context } from "@netlify/functions";
import { createClient } from "redis";

// run by using yarn netlify dev

export default async (req: Request, context: Context) => {
  const { query } = context.params;
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  // if (requestKey !== apiKey) {
  //   return new Response("Sorry, no access for you.", { status: 401 });
  // }

  const databasePassword = Netlify.env.get("DATABASE_PASSWORD");
  const client = createClient({
    url: `redis://default:${databasePassword}@us1-moving-glider-41412.upstash.io:41412`,
  });

  client.on("error", function (err) {
    console.log(err);
  });

  await client.connect();

  let result = await client.ft.search("idx:bands", query);
  // let result = await client.ft.search("idx:bands", `query @age:[30 40]`);

  client.quit();

  
  return new Response(JSON.stringify(result));
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