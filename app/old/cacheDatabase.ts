import { createClient } from "redis";

export async function connectCacheClient() {
  const cachedb = Netlify.env.get("CACHE_DB");
  const client = createClient({
    url: cachedb,
    pingInterval: 1000,
  });

  client.on("error", function (err) {
    console.error("client error: ", err);
    throw err;
  });

  await client.connect();
  return client;
}
