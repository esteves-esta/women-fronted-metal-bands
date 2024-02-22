import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./database";

export default async (req: Request, context: Context) => {
  console.log(context.params);

  const { query, col, page, limit, sort, sortBy, filter } = context.params;

  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  // if (requestKey !== apiKey) {
  //   return Response.json("Sorry, no access for you.", { status: 401 });
  // }

  const client = await connectClient();

  let searchQuery = getSearchQuery(query, col);

  searchQuery += getFilterQuery(filter);

  /* SORT AND LIMIT */
  let searchOption: { LIMIT?: any; SORTBY?: any } = getSortAndLimit({
    sort,
    sortBy,
    limit,
    page,
  });

  console.log({ searchQuery });
  console.log({ searchOption });
  console.log({ searchOptions: Object.keys(searchOption).length > 0 });

  /* DATABASE FULL TEXT SEARCH */
  let result;
  if (Object.keys(searchOption).length > 0)
    result = await client.ft.search("idx:bands", searchQuery, searchOption);
  else result = await client.ft.search("idx:bands", searchQuery);

  client.quit();

  console.log({ result: result.documents.length });
  return Response.json(result);
};

export const config: Config = {
  path: "/search/:query/:col/:page/:limit/:sort/:sortBy/:filter",
};
//localhost:8888/search/brazil/country/10/10/ASC/growling/active
// https://teste--women-fronted-metal-bands.netlify.app/hello

function getSearchQuery(query: string, col: string) {
  const searchCols = [
    "band",
    "country",
    "vocalists",
    "numberOfVocalists",
    "activeFor",
    "yearStarted",
    "yearEnded",
  ];

  if (query === "null") return `*`;

  if (col === "null" || !searchCols.includes(col)) return `*${query}*`;

  switch (col) {
    case "numberOfVocalists":
      if (!Number.isNaN(query)) return `@${col}:[${query} ${query}]`;
      return `*${query}*`;

    case "activeFor":
      if (!Number.isNaN(query)) return `@${col}:[${query} ${query}]`;
      return `*${query}*`;

    case "vocalists":
      return `(@currentVocalists:*${query}*) (@pastVocalists:*${query}*)`;

    default:
      return `@${col}:*${query}*`;
  }
}

function getFilterQuery(filter) {
  const filterCols = [
    "active",
    "disbanded",
    "allwomen",
    "blackwomen",
    "mixedGender",
    "sister",
  ];
  if (!filterCols.includes(filter)) return "";
  switch (filter) {
    case "active":
      return ` @yearEnded:[0 0]`;

    case "disbanded":
      return ` @yearEnded:[1 +inf]`;

    case "mixedGender":
      return ` @allWomen:{false}`;

    default:
      return ` @${filter}:{true}`;
  }
}

function getSortAndLimit({ sort, sortBy, limit, page }) {
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
  return searchOption;
}
