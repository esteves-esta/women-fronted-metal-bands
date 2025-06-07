import { readFile, writeFile } from "./file-helper.js"
import countryCodes from "./codes.js"
import { v4 as uuidv4 } from "uuid";

const LIST_PATH = '../list-of-metal-bands/metal-archives-bands.json'
const NOTENDSTART_PATH = '../list-of-metal-bands/notStartEnd.json'
const ERRORS_PATH = './errors.json'

const formatYearsActive = (data) => {
  const { yearStarted, yearEnded } = data;
  const thisYear = new Date().getFullYear();
  let activeYears = 0;
  if (yearStarted !== null && !isNaN(yearStarted)) {
    if (Number(yearEnded) !== 0) activeYears = Number(yearEnded) - Number(yearStarted);
    else activeYears = thisYear - Number(yearStarted);
  }
  return activeYears;
};


async function addDinamicCols() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const updated = bands.map(band => {
    let key = band?.id;
    if (!band.id) {
      if (band.deezerId) key = `band:${band.deezerId}`;
      else key = `band:${uuidv4()}`;
    }

    const activeFor = formatYearsActive(band);
    return {
      ...band,
      id: key,
      activeFor,
      numberOfVocalists: band.currentVocalists.length
    }
  })

  await writeFile(LIST_PATH, JSON.stringify(updated, null, "\t"))
}

async function validateCountryCodes() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const errors = []
  bands.forEach(band => {
    if (countryCodes.includes(band.countryCode)) return;
    errors.push(band)
  })
  await writeFile(ERRORS_PATH, JSON.stringify(errors, null, "\t"))
}

async function separateEnds() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const errors = []
  bands.forEach(band => {
    if (!band.yearStarted) errors.push(band)
    else if (typeof band.yearEnded === "string" && isNaN(band.yearEnded)) errors.push(band)
    else if (typeof band.yearStarted === "string" && isNaN(band.yearEnded)) errors.push(band)
  })
  await writeFile(NOTENDSTART_PATH, JSON.stringify(errors, null, "\t"))
}


async function validate() {
  addDinamicCols()
  validateCountryCodes()
}

validate()
