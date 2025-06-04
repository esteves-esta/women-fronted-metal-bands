// import { SearchParams } from "../models/SearchParams"
import { db } from "./db";

export async function getChart(filterCol: string, filterGrow: number) {
  try {
    const result = {}
    await db.bands
      .orderBy('countryCode')
      .filter(band => {
        let grow = true;
        let filter = true;
        if (filterGrow >= 0) grow = band.growling === filterGrow
        if (filterCol) {
          switch (filterCol) {
            case "active": {
              filter = band.yearEnded === 0;
              break;
            }
            case "disbanded": {
              filter = band.yearEnded !== 0;
              break;
            }
            case "mixedGender": {
              filter = !band.allWomenBand;
              break;
            }
            case "viewAll": {
              break;
            }
            default: {
              filter = !!band[filterCol];
              break;
            }
          }
        }

        return filter && grow;
      })
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
