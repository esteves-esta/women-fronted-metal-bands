import { db } from "./db";
import list from "../../list-of-metal-bands/list.json"

export async function populate() {
  await db.bands.bulkAdd(list);
}
