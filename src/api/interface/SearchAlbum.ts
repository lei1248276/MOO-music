export interface SearchAlbumResponse {
  result: AlbumResult
  code: number
}

export interface AlbumResult {
  albums: Album[]
  albumCount: number
}

export interface Album {
  name: string
  id: number
  idStr: string
  type: string
  size: number
  picId: number
  blurPicUrl: string
  companyId: number
  pic: number
  picUrl: string
  publishTime: number
  description: string
  tags: string
  company: string
  briefDesc: string
  artist: Artist
  songs: any[]
  alias: any[]
  status: number
  copyrightId: number
  commentThreadId: string
  artists: Artist2[]
  picId_str: string
  isSub: boolean
}

export interface Artist {
  name: string
  id: number
  picId: number
  img1v1Id: number
  briefDesc: string
  picUrl: string
  img1v1Url: string
  albumSize: number
  alias: string[]
  trans: string
  musicSize: number
  picId_str: string
}

export interface Artist2 {
  name: string
  id: number
  picId: number
  img1v1Id: number
  briefDesc: string
  picUrl: string
  img1v1Url: string
  albumSize: number
  alias: any[]
  trans: string
  musicSize: number
}
