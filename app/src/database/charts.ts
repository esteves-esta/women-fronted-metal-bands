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
    let sumValues = 0;
    let count = 0;
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

    await db.bands
      .orderBy('activeFor')
      .eachKey((activeFor) => {
        const active = Number(activeFor)
        if (active > 0 && active <= 1)
          chartData[0].value += 1;
        if (active > 1 && active <= 2)
          chartData[1].value += 1;
        if (active > 2 && active <= 3)
          chartData[2].value += 1;
        if (active > 3 && active <= 4)
          chartData[3].value += 1;
        if (active >= 5 && active <= 10)
          chartData[4].value += 1;
        if (active > 10 && active <= 20)
          chartData[5].value += 1;
        if (active > 20 && active <= 30)
          chartData[6].value += 1;
        if (active > 30 && active <= 40)
          chartData[7].value += 1;
        if (active > 40 && active <= 50)
          chartData[8].value += 1;

        count += 1;
        sumValues += active;
      });

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

/*
  { value: "viewAll", text: "View All" },
            { value: "active", text: "Active" },
            { value: "disbanded", text: "Disbanded" }
*/
