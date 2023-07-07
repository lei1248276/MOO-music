export interface AlbumListResponse {
  total: number
  albums: Album[]
  code: number
}

export interface Album {
  songs: any[]
  paid: boolean
  onSale: boolean
  mark: number
  awardTags: any
  companyId: number
  blurPicUrl: string
  publishTime: number
  company: string
  alias: any[]
  artists: Artist[]
  copyrightId: number
  picId: number
  artist: Artist2
  pic: number
  briefDesc: string
  picUrl: string
  commentThreadId: string
  tags: string
  description: string
  status: number
  subType: string
  name: string
  id: number
  type: string
  size: number
  picId_str: string
}

export interface Artist {
  img1v1Id: number
  topicPerson: number
  followed: boolean
  alias: any[]
  picId: number
  musicSize: number
  albumSize: number
  briefDesc: string
  picUrl: string
  img1v1Url: string
  trans: string
  name: string
  id: number
  img1v1Id_str: string
}

export interface Artist2 {
  img1v1Id: number
  topicPerson: number
  followed: boolean
  alias: string[]
  picId: number
  musicSize: number
  albumSize: number
  briefDesc: string
  picUrl: string
  img1v1Url: string
  trans: string
  name: string
  id: number
  picId_str: string
  img1v1Id_str: string
  transNames?: string[]
}
