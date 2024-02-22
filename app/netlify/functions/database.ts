import { createClient, SchemaFieldTypes } from "redis";

export async function connectClient() {
  // const databasePassword = Netlify.env.get("DATABASE_PASSWORD");
  const databasePassword = Netlify.env.get("DB_PASSWORD");

  // const client = createClient({
  //   url: `redis://default:${databasePassword}@redis-19105.c279.us-central1-1.gce.cloud.redislabs.com:19105`,
  //   // url: `redis://default:${databasePassword}@us1-moving-glider-41412.upstash.io:41412`,
  // });

  const client = createClient({
    password: databasePassword,
    socket: {
      host: "redis-19105.c279.us-central1-1.gce.cloud.redislabs.com",
      port: 19105,
    },
  });

  client.on("error", function (err) {
    console.log("client error: ", err);
  });
  await client.connect();

  return client;
}

export async function loadData() {
  const listJSON = require("../../list-of-metal-bands/list.json");
  console.log("oi");
  const client = await connectClient();

  //https://redis.io/commands/dbsize/
  const itemsOnDB = await client.dbSize();

  if (itemsOnDB === listJSON.length) {
    return {
      errorCount: 0,
      message: "Everything is updated on the database !!",
    };
  }

  // clean db
  await client.flushDb();

  // Create an index.
  try {
    await client.ft.create(
      "idx:bands",
      {
        "$.allWomenBand": {
          type: SchemaFieldTypes.TAG,
          AS: "allWomenBand",
          SORTABLE: true,
        },
        "$.band": {
          type: SchemaFieldTypes.TEXT,
          AS: "band",
          SORTABLE: true,
        },
        "$.blackWomen": {
          type: SchemaFieldTypes.TAG,
          AS: "blackWomen",
          SORTABLE: true,
        },
        "$.country": {
          type: SchemaFieldTypes.TEXT,
          AS: "country",
          SORTABLE: true,
        },
        "$.countryCode": {
          type: SchemaFieldTypes.TEXT,
          AS: "countryCode",
          SORTABLE: true,
        },
        "$.deezerId": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "deezerId",
        },
        "$.deezerRecommendationId": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "deezerRecommendationId",
        },
        "$.growling": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "growling",
          SORTABLE: true,
        },
        // "$.links": {
        //   type: SchemaFieldTypes.TEXT,
        // },
        // "$.recommendation": {
        //   type: SchemaFieldTypes.TEXT,
        // },
        // "$.recommendationIsCover": {
        //   type: SchemaFieldTypes.TAG,
        // },
        "$.sister": {
          type: SchemaFieldTypes.TAG,
        },
        "$.yearEnded": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "yearEnded",
        },
        "$.yearStarted": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "yearStarted",
        },
        "$.currentVocalists.*": {
          type: SchemaFieldTypes.TEXT,
          AS: "currentVocalists",
        },
        "$.pastVocalists.*": {
          type: SchemaFieldTypes.TEXT,
          AS: "pastVocalists",
        },
      },
      {
        ON: "JSON",
        PREFIX: "band:",
      }
    );
  } catch (e) {
    if (e.message === "Index already exists") {
      console.log("Index exists already, skipped creation.");
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      // process.exit(1);
    }
  }

  // fill db
  const responses = await Promise.all(
    listJSON.map((item) => {
      let key = crypto.randomUUID();
      if (item.deezerId) key = item.deezerId;
      if (item.deezerRecommendationId) key = item.deezerRecommendationId;

// todo 
/* 
before adding to database 
- calculate active year
- calculate number of vocalist
-
 */

      return client.json.set(`band:${key}`, "$", item);
    })
  );

  client.quit();

  //https://github.com/redislabs-training/node-js-crash-course/blob/main/src/utils/dataloader.js
  let errorCount = 0;
  for (const response of responses) {
    if (response !== "OK") {
      errorCount += 1;
    }
  }
  return { errorCount, message: "Database updated" };
}
