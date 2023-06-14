export interface SearchSuggestResponse {
  result: Result
  code: number
}

export interface Result {
  allMatch: Suggests[]
}

export interface Suggests {
  keyword: string
  type: number
  alg: string
  lastKeyword: string
  feature: string
}
