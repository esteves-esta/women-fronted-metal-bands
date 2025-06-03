// import { SearchParams } from "../models/SearchParams"
import { db } from "./db";

export async function getChart() {
  try {
    const result = {}
    await db.bands
      .orderBy('countryCode')
      .filter(band => !!band.sister)
      .eachKey(countryCode => {
        const code = countryCode.toString()
        result[code] = (result[code] || 0) + 1;
      });
    return result;
  }
  catch (e) {
    console.log(e)
  }
}
