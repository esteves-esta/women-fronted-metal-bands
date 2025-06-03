export interface SearchParams {
  query: string | null;
  col: string | null;
  page: number;
  limit: number;
  sort: "desc" | "asc";
  sortBy: string;
  filter: string | null;
  growling: number | null;
}
