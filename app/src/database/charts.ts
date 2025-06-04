// import { SearchParams } from "../models/SearchParams"
import { db } from "./db";

export async function getCountryCountChart(filterCol: string, filterGrow: number) {
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

export async function getGenreChart() {
  try {
    const result = {}
    await db.bands
      .orderBy('genre')
      .eachKey(genre => {
        const code = genre.toString()
        result[code] = (result[code] || 0) + 1;
      });
    return result;
  }
  catch (e) {
    console.log(e)
  }
}

export async function getBandsActive() {
  try {

    let chartData = [
      { id: "1", value: 0 },
      { id: "2", value: 0 },
      { id: "3", value: 0 },
      { id: "4", value: 0 },
      { id: "5-10", value: 0 },
      { id: "10-20", value: 0 },
      { id: "20-30", value: 0 },
      { id: "30-40", value: 0 },
      { id: "40-50", value: 0 },
    ];

    const beginEnd = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 11],
      [10, 20],
      [20, 30],
      [30, 40],
      [40, 50],
    ];

    let sumValues = 0;
    let count = 0;

    await db.transaction('r', db.bands, async () => {
      count = await db.bands.count()

      await db.bands
        .orderBy('activeFor')
        .eachKey((activeFor) => { sumValues += Number(activeFor) });

      await beginEnd.forEach(async ([start, end], index) => {
        chartData[index].value = await db.bands
          .where("activeFor").between(start, end)
          .count()
      })
      0;

    })
    return { chartData, average: Math.round(sumValues / count) };
  }
  catch (e) {
    console.log(e)
  }
}


export async function getDetails(filter: string) {
  try {
    const allwomenData = [
      { id: "all women", value: 0 },
      { id: "mixed", value: 0 },
    ];
    const blackwomenData = [
      { id: "other", value: 0 },
      { id: "black women", value: 0 },
    ];
    const sisterData = [
      { id: "yes", value: 0 },
      { id: "no", value: 0 },
    ];

    const statusData = [
      { id: "active", value: 0 },
      { id: "disbanded", value: 0 },
    ];
    let filters = (band) => true
    if (filter && filter != "viewAll") {
      switch (filter) {
        case "active":
          filters = (band) => !band.yearEnded;
          break;
        case "disbanded":
          filters = (band) => !!band.yearEnded;
          break;
      }
    }
    await db.bands
      .filter(band => !band.allWomenBand && filters(band))
      .eachKey(() => {
        allwomenData[0].value += 1;
      });

    await db.bands
      .filter(band => band.allWomenBand && filters(band))
      .eachKey(() => {
        allwomenData[1].value += 1;
      });

    await db.bands
      .filter(band => !band.blackWomen && filters(band))
      .eachKey(() => {
        blackwomenData[0].value += 1;
      });

    await db.bands
      .filter(band => band.blackWomen && filters(band))
      .eachKey(() => {
        blackwomenData[1].value += 1;
      });

    await db.bands
      .filter(band => !band.sister && filters(band))
      .eachKey(() => {
        sisterData[0].value += 1;
      });

    await db.bands
      .filter(band => band.sister && filters(band))
      .eachKey(() => {
        sisterData[1].value += 1;
      });

    await db.bands
      .filter(band => !band.yearEnded)
      .eachKey(() => {
        statusData[0].value += 1;
      });

    await db.bands
      .filter(band => !!band.yearEnded)
      .eachKey(() => {
        statusData[1].value += 1;
      });

    return {
      allwomenData,
      blackwomenData,
      sisterData,
      statusData
    };
  }
  catch (e) {
    console.log(e)
  }


}


export async function getActivityByEachDecade() {
  try {
    let chartData: any[] = [
      { id: "1970", value: [] },
      { id: "1980", value: 0 },
      { id: "1990", value: 0 },
      { id: "2000", value: 0 },
      { id: "2010", value: 0 },
      { id: "2020", value: 0 },
    ];

    const decadeBeginEnd = [
      [1970, 1980],
      [1980, 1990],
      [1990, 2000],
      [2000, 2010],
      [2010, 2020],
      [2020, 2030],
    ];

    await decadeBeginEnd.forEach(async ([start, end], index) => {
      chartData[index].value = await db.bands
        .where("yearStarted").between(start, end)
        .count()
    })

    return chartData;
  }
  catch (e) {
    console.log(e)
  }
}
