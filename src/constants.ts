import { TagInfo } from "./components/Tag";

export const booleanTagList: TagInfo[] = [
  { value: true, text: "sim", type: "success" },
  { value: false, text: "não", type: "danger" }
];

export const growTagList: TagInfo[] = [
  { value: 0, text: "None", type: "deep-1" },
  { value: 1, text: "Few", type: "deep-2" },
  { value: 2, text: "Medium", type: "deep-3" },
  { value: 3, text: "High", type: "deep-4" }
];
