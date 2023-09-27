export interface NewMVResponse {
  data: Array<{
    id: number
    cover: string
    name: string
    playCount: number
    briefDesc: any
    desc: any
    artistName: string
    artistId: number
    duration: number
    mark: number
    subed: boolean
    artists: Array<{
      id: number
      name: string
    }>
    alias?: Array<string>
    transNames?: Array<string>
  }>
  code: number
}
