export interface SearchArtistResponse {
  result: ArtistResult
  code: number
}

export interface ArtistResult {
  artistCount: number
  artists: Artist[]
  searchQcReminder: any
}

export interface Artist {
  id: number
  name: string
  picUrl: string
  alias: any[]
  albumSize: number
  picId: number
  fansGroup: any
  img1v1Url: string
  accountId: number
  img1v1: number
  mvSize: number
  followed: boolean
  trans: any
}
