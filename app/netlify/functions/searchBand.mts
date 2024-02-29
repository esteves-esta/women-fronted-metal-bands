import type { Config, Context } from "@netlify/functions";
import { connectClient } from "./utils/database";
import { authAPI } from "./utils/auth";

export default async (req: Request, context: Context) => {
  // console.log(context.params);
  authAPI(req);
  const { query, col, page, limit, sort, sortBy, filter, growling } =
    context.params;
  let client;

  try {
    client = await connectClient();
  } catch (e) {
    console.log("cliente " + e);
    return Response.json("Connection error.", { status: 500 });
  }

  // SEARCH AND FILTER
  let searchQuery = getSearchQuery(query, col);
  searchQuery += getFilterQuery(filter);
  searchQuery += getGrowlingFilter(growling);

  /* SORT AND LIMIT */
  let searchOption: { LIMIT?: any; SORTBY?: any } = getSortAndLimit({
    sort,
    sortBy,
    limit,
    page,
  });
  if (searchQuery.length > 1 && searchQuery.includes("*"))
    searchQuery = searchQuery.replace("*", "").trim();

  console.log({ searchQuery });
  console.log({ searchOption });
  console.log({ searchOptions: Object.keys(searchOption).length > 0 });

  /* DATABASE FULL TEXT SEARCH */
  let result;
  try {
    if (Object.keys(searchOption).length > 0)
      result = await client.ft.search("idx:bands", searchQuery, searchOption);
    else result = await client.ft.search("idx:bands", searchQuery);
  } catch (e) {
    console.log("search error: " + e);
    return Response.json("Error " + e, { status: 500 });
  }

  client.quit();

  // console.log({ result: result.documents.length });
  let docs = [];
  if (result.documents) {
    docs = result.documents.map((item) => {
      return {
        ...item.value,
        id: item.id,
      };
    });
  }
  return Response.json({
    total: result.total,
    documents: docs,
  });
};

export const config: Config = {
  path: "/api/search/:query/:col/:page/:limit/:sort/:sortBy/:filter/:growling",
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
    "allWomen",
    "blackWomen",
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
      return ` @allWomenBand:{false}`;

    case "allWomen":
      return ` @allWomenBand:{true}`;
    default:
      return ` @${filter}:{true}`;
  }
}

function getGrowlingFilter(growling) {
  if (Number.isNaN(Number(growling))) return "";

  return ` @growling:[${growling} ${growling}]`;
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
