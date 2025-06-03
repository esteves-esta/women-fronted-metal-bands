import { cloneElement } from "react";
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
  if (query) {
    if (col) {
      var regex = RegExp(query.toString(), 'i');
      return collection.filter(item => regex.test(item[col]));
    }
    else {
      if (!isNumeric(query)) {
        var regex = RegExp(query, 'i');
        return collection.filter(item =>
          regex.test(item.band) ||
          regex.test(item.country) ||
          regex.test(item.currentVocalists.toString() + item.pastVocalists.toString())
        );
      }
      else {
        const queryNum = Number(query)
        return collection.filter(item =>
          item.activeFor === queryNum ||
          item.currentVocalists.length === queryNum ||
          item.yearStarted === queryNum ||
          item.yearEnded === queryNum
        );
      }
    }
  }
  return collection;
}

function filtersBuild(searchParams: SearchParams,
  collection: Table<BandDb, number, BandDb> | Collection<BandDb, number, BandDb>) {
  let method = 'filter';
  if ('and' in collection)
    method = 'and';
  const { growling, filter: filterParam } = searchParams;
  if (growling) {
    collection = collection[method](item => item.growling === growling)
  }
  if (filterParam) {
    const filters = filterParam.split(',');
    switch (filterParam) {
      case "active":
        {
          return collection[method](t => t.yearEnded !== 0)
        }
      case "disbanded":
        {
          return collection[method](item => item.yearEnded === 0)
        }
      case "allWomen":
        {
          return collection[method](item => item.allWomenBand)
        }
      case "mixedGender":
        {
          return collection[method](item => !item.allWomenBand)
        }
      case "blackWomen":
        {
          return collection[method](item => item.blackWomen)
        }
      case "sister":
        {
          return collection[method](item => item.sister)
        }
      default:
        {
          return collection
        }
    }
  }
  return collection
}
function sortBuild(searchParams: SearchParams, collection: any) {
  const { sort, sortBy, } = searchParams;
  if (sort === "desc") {
    return collection.reverse().sortBy(sortBy || 'growling');
  } else {
    return collection.sortBy(sortBy || 'growling');
  }
  // collection = collection.orderBy(sortBy || 'growling')
  // if (sort === "desc")
  //   return collection.reverse()
  // return collection
}



