import { TagInfo } from "./components/Tag";

export const DEEZER_API = import.meta.env.DEV
  ? "http://localhost:8888/"
  : "https://women-fronted-metal-bands.netlify.app/";
// teste--
export const booleanTagList: TagInfo[] = [
  { value: true, text: "Yes", type: "success" },
  { value: false, text: "No", type: "dark" },
];

export const growTagList: TagInfo[] = [
  { value: 3, text: "High", type: "deep-4" },
  { value: 2, text: "Medium", type: "deep-3" },
  { value: 1, text: "Few", type: "deep-2" },
  { value: 0, text: "None", type: "deep-1" },
];

export const filterByDetailsOptions = [
  { value: "viewAll", text: "View All" },
  { value: "active", text: "Active" },
  { value: "disbanded", text: "Disbanded" },
  { value: "allWomen", text: "All women" },
  { value: "mixedGender", text: "Mixed gender" },
  { value: "blackWomen", text: "Black women" },
  { value: "sister", text: "Sisters" },
];

export const growFilterOptions = [
  { value: "viewAll", text: "View All" },
  ...growTagList,
];
