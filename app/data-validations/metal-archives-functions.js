import { readFile, writeFile } from "./file-helper.js"
import countryCodes from "./codes.js"
import { v4 as uuidv4 } from "uuid";

const LIST_PATH = "../metal-archives-2/metal-archives-bands.json"
const NOTENDSTART_PATH = "../metal-archives-2/no-end-start.json"

const backing = "../metal-archives-2/backing.json"
//  ----------------------------
async function backingvocals() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const errors = []
  const ok = []
  bands.forEach(band => {
    if (JSON.stringify(band.members).toLowerCase().includes('backing')) errors.push(band)
    else {
      ok.push(band)
    }
  })
  console.log({ ok: ok.length, errors: errors.length })
  await writeFile(backing, JSON.stringify(errors, null, "\t"))
  await writeFile(LIST_PATH, JSON.stringify(ok, null, "\t"))
}


// backingvocals()

//  ----------------------------
async function separateEnds() {
  const bands = JSON.parse(await readFile(LIST_PATH))
  const errors = []
  const ok = []
  bands.forEach(band => {
    if (band.yearStarted === "?" || band.yearEnded === "?")  errors.push(band)
    else {
      ok.push(band)
    }
  })
  console.log({ ok: ok.length, errors: errors.length })
  await writeFile(NOTENDSTART_PATH, JSON.stringify(errors, null, "\t"))
  await writeFile(LIST_PATH, JSON.stringify(ok, null, "\t"))
}


//separateEnds()
//  ----------------------------

// country International needs to check what country the band operates most

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
  console.log({ list: list.length, apart: apart.length })
  await writeFile(NOTENDSTART_PATH, JSON.stringify(apart, null, "\t"))
  await writeFile(LIST_PATH, JSON.stringify(list, null, "\t"))
}

//international()

//  ----------------------------
const ACTIVE_PATH = "../metal-archives-2/active.json"
const DISBANDED_PATH = "../metal-archives-2/disbanded.json"

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
//active()


//  ----------------------------
// SORT

async function sorting() {
  const bands = JSON.parse(await readFile(LIST_PATH))

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

 // sorting()

//  ----------------------------
// CHECK IF BAND EXIST ON LIST AND UPDATE LIST
const LIST_FINAL_PATH = "../list-of-metal-bands/list.json"
const ALREADY_PATH = "../metal-archives-2/already.json"

async function checkAndUpdate() {
  const bands = JSON.parse(await readFile(LIST_FINAL_PATH))
  const other = JSON.parse(await readFile(LIST_PATH))
  const already = []
  const updated = []

  bands.forEach(band => {
    const found = other.find(item => item.band === band.band)
    if (found) {
      already.push(found);
      const genre = band.genre ? band.genre : found.genre
      updated.push({
        ...band,
        metalArchivesId: found.metalArchivesId,
        yearStarted: found.yearStarted,
        yearEnded: found.yearEnded,
        activeFor: found.activeFor,
        genre,
      })
      return
    }
    updated.push(band)
  })
  console.log({ already: already.length })
  await writeFile(LIST_FINAL_PATH, JSON.stringify(updated, null, "\t"))
  const alrt = JSON.parse(await readFile(ALREADY_PATH))
  await writeFile(ALREADY_PATH, JSON.stringify([...alrt, ...already], null, "\t"))
}
// checkAndUpdate()

async function checkAndRemove() {
  const alreadyOnList = JSON.parse(await readFile(ALREADY_PATH))
  const other = JSON.parse(await readFile(LIST_PATH))
  const updated = []

  other.forEach(band => {
    const found = alreadyOnList.find(item => item.band === band.band)
    if (found) return
    updated.push(band)
  })
  console.log({ other: other.length, updated: updated.length, alreadyOnList: alreadyOnList.length })
  await writeFile(ACTIVE_PATH, JSON.stringify(updated, null, "\t"))
}
// checkAndRemove()


// https://dexie.org/docs/Collection/Collection.offset()
// https://dexie.org/docs/Tutorial/React
