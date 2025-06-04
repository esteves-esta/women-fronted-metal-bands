import { SearchParams } from "../models/SearchParams"
import { BandDb, db } from "./db";
import { Collection, Table } from "dexie";


function isNumeric(str: unknown) {
  if (typeof str != "string") return false // we only process strings!
  // @ts-expect-error
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function searchQueryBuild(searchParams: SearchParams) {
  try {
    let collection: any = db.bands;
    collection = queryBuild(searchParams, collection)
    collection = filtersBuild(searchParams, collection)
    collection = sortBuild(searchParams, collection)
    return collection
  }
  catch (e) {
    console.log(e)
  }
}

function queryBuild(searchParams: SearchParams,
  collection: any) {
  const { query, col } = searchParams;
  if (!query) return collection;

  if (col) {
    var regex = RegExp(query.toString(), 'i');
    return collection.filter(band => regex.test(band[col]));
  }

  if (!isNumeric(query)) {
    var regex = RegExp(query, 'i');
    return collection.filter(item =>
      regex.test(item.band) ||
      regex.test(item.country) ||
      regex.test(item.currentVocalists.toString() + item.pastVocalists.toString())
    );
  }

  const queryNum = Number(query)
  return collection.filter(item =>
    item.activeFor === queryNum ||
    item.currentVocalists.length === queryNum ||
    item.yearStarted === queryNum ||
    item.yearEnded === queryNum
  );

}

function filtersBuild(
  searchParams: SearchParams,
  collection: Table<BandDb, number, BandDb> | Collection<BandDb, number, BandDb>
) {
  const { growling, filter } = searchParams;
  if ((growling === null || growling === undefined) && !filter) return collection;
  if ('filter' in collection)
    return collection.filter(band => {
      let growl = true;
      let active = true;
      let disband = true;
      let allWomen = true;
      let mixed = true;
      let black = true;
      let sister = true;
      if (growling) growl = band.growling === Number(growling)

      if (!filter) return growl;
      const filters = filter.split(',');

      if (filters.includes('active')) active = band.yearEnded === 0
      if (filters.includes('disbanded')) disband = band.yearEnded !== 0
      if (filters.includes('allWomen')) allWomen = !!band.allWomenBand
      if (filters.includes('mixedGender')) mixed = !band.allWomenBand
      if (filters.includes('blackWomen')) black = !!band.blackWomen
      if (filters.includes('sister')) sister = !!band.sister

      return growl && active && disband && allWomen && mixed && black && sister;
    })
}

function sortBuild(searchParams: SearchParams, collection: any) {
  const { sort, sortBy, } = searchParams;
  const sortByCol = sortBy || 'growling'
  if (sort === "desc") {
    return collection.reverse().sortBy(sortByCol);
  } else {
    return collection.sortBy(sortByCol);
  }
}



