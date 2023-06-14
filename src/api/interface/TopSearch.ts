export interface TopSearchResponse {
  code: number
  result: Result
}

export interface Result {
  hots: TopSearch[]
}

export interface TopSearch {
  first: string
  second: number
  third: any
  iconType: number
}
