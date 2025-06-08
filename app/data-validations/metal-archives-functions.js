import { readFile, writeFile } from "./file-helper.js"
import countryCodes from "./codes.js"
import { v4 as uuidv4 } from "uuid";

const LIST_PATH = "../metal-archives-data-to-analyze/metal-archives-bands.json"
const NOTENDSTART_PATH = "../metal-archives-data-to-analyze/no-end-start.json"

//  ----------------------------
async function separateEnds() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const errors = []
  const ok = []
  bands.forEach(band => {
    if (band.yearStarted === "N/A") errors.push(band)
    else {
      ok.push(band)
    }
  })
  console.log({ ok: ok.length, errors: errors.length })
  await writeFile(NOTENDSTART_PATH, JSON.stringify(errors, null, "\t"))
  await writeFile(LIST_PATH, JSON.stringify(ok, null, "\t"))
}


// separateEnds()

//  ----------------------------

// country International needs to check what country the band operates most
const INTERNATIONAL_PATH = "../metal-archives-data-to-analyze/international.json";

async function international() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const list = []
  const apart = []

  bands.forEach(band => {
    if (band.country === "International") apart.push(band)
    else {
      list.push(band)
    }
  })
  // console.log({ list: list.length, apart: apart.length })
  await writeFile(INTERNATIONAL_PATH, JSON.stringify(apart, null, "\t"))
  await writeFile(LIST_PATH, JSON.stringify(list, null, "\t"))
}

// international()

//  ----------------------------
const ACTIVE_PATH = "../metal-archives-data-to-analyze/active.json"
const DISBANDED_PATH = "../metal-archives-data-to-analyze/disbanded.json"

async function active() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const active = []
  const disbanded = []
  bands.forEach(band => {
    if (band.yearEnded === 0) active.push(band)
    else {
      disbanded.push(band)
    }
  })
  console.log({ active: active.length, disbanded: disbanded.length })
  await writeFile(ACTIVE_PATH, JSON.stringify(active, null, "\t"))
  await writeFile(DISBANDED_PATH, JSON.stringify(disbanded, null, "\t"))
}
// active()


//  ----------------------------
// SORT

async function sorting() {
  const bands = JSON.parse(await readFile(DISBANDED_PATH))

  function compareFn(a, b) {
    if (a.activeFor < b.activeFor) {
      return -1;
    } else if (a.activeFor > b.activeFor) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }

  bands.sort(compareFn)

  await writeFile(DISBANDED_PATH, JSON.stringify(bands, null, "\t"))
}

sorting()

//  ----------------------------
// SORT

// get heavy / dark  metal genres
// melodic genre
