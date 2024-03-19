import { createClient } from "redis";

export async function connectCacheClient() {
  const databasePassword = Netlify.env.get("DATABASE_PASSWORD");
  const client = createClient({
    url: `redis://default:${databasePassword}@us1-moving-glider-41412.upstash.io:41412`,
  });

  client.on("error", function (err) {
    console.log("client error: ", err);
  });

  await client.connect();
  return client;
}
