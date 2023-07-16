export interface ArtistAlbumsResponse {
  artist: Artist
  hotAlbums: HotAlbum[]
  more: boolean
  code: number
}

export interface Artist {
  img1v1Id: number
  topicPerson: number
  alias: any[]
  picId: number
  trans: string
  briefDesc: string
  musicSize: number
  albumSize: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  name: string
  id: number
  picId_str: string
  img1v1Id_str: string
}

export interface HotAlbum {
  songs: any[]
  paid: boolean
  onSale: boolean
  mark: number
  awardTags: any
  companyId: number
  blurPicUrl: string
  alias: string[]
  artists: Artist2[]
  copyrightId: number
  picId: number
  artist: Artist3
  publishTime: number
  company: string
  briefDesc: string
  picUrl: string
  commentThreadId: string
  pic: number
  description: string
  tags: string
  status: number
  subType: string
  name: string
  id: number
  type: string
  size: number
  picId_str: string
  isSub: boolean
  transNames?: string[]
}

export interface Artist2 {
  img1v1Id: number
  topicPerson: number
  alias: any[]
  picId: number
  trans: string
  briefDesc: string
  musicSize: number
  albumSize: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  name: string
  id: number
  img1v1Id_str: string
}

export interface Artist3 {
  img1v1Id: number
  topicPerson: number
  alias: string[]
  picId: number
  trans: string
  briefDesc: string
  musicSize: number
  albumSize: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  name: string
  id: number
  picId_str: string
  img1v1Id_str: string
}
