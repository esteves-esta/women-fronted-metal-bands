import { createClient, SchemaFieldTypes } from "redis";
import { v4 as uuidv4 } from "uuid";

let client;

export async function connectClient() {
  // process.env.DB_PASSWORD
  const databasePassword = Netlify.env.get("DB_PASSWORD");
  if (client && client.connected) return client;

  client = createClient({
    password: databasePassword,
    socket: {
      host: "redis-19242.c228.us-central1-1.gce.cloud.redislabs.com",
      port: 19242
    }
  });

  client.on("error", function (err) {
    console.error("client error: ", err);
  });
  await client.connect();
  return client;
}

export async function loadData() {
  const listJSON = require("../../../list-of-metal-bands/list.json");

  let client;

  try {
    client = await connectClient();
  } catch (e) {
    console.log("cliente " + e);
    return {
      errorCount: 1,
      message: "Connection error!"
    };
  }

  //https://redis.io/commands/dbsize/
  const itemsOnDB = await client.dbSize();

  if (itemsOnDB === listJSON.length) {
    return {
      errorCount: 0,
      message: "Nothing updated, database is up to date !!"
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
          SORTABLE: true
        },
        "$.band": {
          type: SchemaFieldTypes.TEXT,
          AS: "band",
          SORTABLE: true
        },
        "$.blackWomen": {
          type: SchemaFieldTypes.TAG,
          AS: "blackWomen",
          SORTABLE: true
        },
        "$.country": {
          type: SchemaFieldTypes.TEXT,
          AS: "country",
          SORTABLE: true
        },
        "$.countryCode": {
          type: SchemaFieldTypes.TEXT,
          AS: "countryCode",
          SORTABLE: true
        },
        "$.growling": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "growling",
          SORTABLE: true
        },
        "$.activeFor": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "activeFor",
          SORTABLE: true
        },
        "$.numberOfVocalists": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "numberOfVocalists",
          SORTABLE: true
        },
        "$.sister": {
          type: SchemaFieldTypes.TAG,
          AS: "sister",
          SORTABLE: true
        },
        "$.yearEnded": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "yearEnded",
          SORTABLE: true
        },
        "$.yearStarted": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "yearStarted",
          SORTABLE: true
        },
        "$.genre.*": {
          type: SchemaFieldTypes.TEXT,
          AS: "genre"
        },
        "$.currentVocalists.*": {
          type: SchemaFieldTypes.TEXT,
          AS: "currentVocalists"
        },
        "$.pastVocalists.*": {
          type: SchemaFieldTypes.TEXT,
          AS: "pastVocalists"
        }
      },
      {
        ON: "JSON",
        PREFIX: "band:"
      }
    );
  } catch (e) {
    if (e.message === "Index already exists") {
      console.log("Index exists already, skipped creation.");
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error("index creation error: " + e);
      // process.exit(1);
    }
  }
  const newItemsCount = listJSON.length - itemsOnDB;
  const newItemsToAdd = listJSON.splice(itemsOnDB, newItemsCount);

  // fill db
  const responses = await Promise.all(
    newItemsToAdd.map((item) => {
      let key = item?.key;
      if (!item?.key) key = uuidv4();
      if (item.deezerId) key = item.deezerId;

      const activeFor = formatYearsActive(item);

      return client.json.set(`band:${key}`, "$", {
        ...item,
        activeFor,
        numberOfVocalists: item.currentVocalists.length
      });
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

export const formatYearsActive = (data) => {
  const { yearStarted, yearEnded } = data;

  const thisYear = new Date().getFullYear();

  let activeYears = 0;
  if (yearStarted !== null) {
    if (yearEnded !== 0) activeYears = yearEnded - yearStarted;
    else activeYears = thisYear - yearStarted;
  }
  return activeYears;
};

// run by using yarn netlify dev
/* 
  https://app.netlify.com/
  https://app.redislabs.com/#/login
  https://redis.io/commands/ft.search/ 
  https://redis.io/docs/interact/search-and-query/query/
  */

// https://dev.to/myogeshchavan97/using-serverless-redis-as-database-for-netlify-functions-2mii
/* 
https://redis.io/docs/connect/clients/nodejs/
https://docs.netlify.com/functions/get-started/#write-a-function

https://github.com/redis/node-redis/blob/master/packages/search/README.md
https://github.com/redis/node-redis/blob/master/examples/managing-json.js
https://redis.io/docs/connect/clients/nodejs/


https://github.com/redis/node-redis/blob/master/examples/search-json.js
https://redis.io/commands/ft.create/#description
https://github.com/RediSearch/RediSearch/issues/2293#issuecomment-941987561
https://learn.redis.com/kb/doc/2dhiyayzpm/how-to-model-a-boolean-at-index-creation-time
https://redis.io/docs/interact/search-and-query/indexing/
*/
