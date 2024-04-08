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

  let response;
  const data: any[] = [];

  try {
    response = await client.ft.aggregate("idx:bands", "*", {
      STEPS: [
        {
          type: AggregateSteps.GROUPBY,
          properties: ["@genre"],
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

  response.results.map((item) => {
    data.push({ text: item.genre, value: item.count });
  });

  return Response.json(data);
};

export const config: Config = {
  path: "/chart/genre",
};
