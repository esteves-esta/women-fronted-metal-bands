import { TagInfo } from "../Tag"

export interface TableColumn {
  key?: string,
  headerLabel: string,
  img?: { source: string, alt: string }

  field?: string,
  format?: (val) => string | boolean,
  formatElement?: (val) => React.ReactNode,
  filter: boolean,
  sortable?: boolean
  sort?: 'desc' | 'asc'
  handleSort?: (valA, valB, sort) => number,
  visible: boolean
  tag?: boolean
  tagList?: TagInfo[]
}