export interface ArtistResponse {
  code: number
  message: string
  data: ArtistData
}

export interface ArtistData {
  videoCount: number
  vipRights: any
  identify: Identify
  artist: Artist
  blacklist: boolean
  preferShow: number
  showPriMsg: boolean
  secondaryExpertIdentiy: SecondaryExpertIdentiy[]
  eventCount: number
  user: User
}

export interface Identify {
  imageUrl: string
  imageDesc: string
  actionUrl: string
}

export interface Artist {
  id: number
  cover: string
  avatar: string
  name: string
  transNames: string[]
  alias: string[]
  identities: string[]
  identifyTag: string[]
  briefDesc: string
  rank: Rank
  albumSize: number
  musicSize: number
  mvSize: number
}

export interface Rank {
  rank: number
  type: number
}

export interface SecondaryExpertIdentiy {
  expertIdentiyId: number
  expertIdentiyName: string
  expertIdentiyCount: number
}

export interface User {
  backgroundUrl: string
  birthday: number
  detailDescription: string
  authenticated: boolean
  gender: number
  city: number
  signature: string
  description: string
  remarkName: any
  shortUserName: string
  accountStatus: number
  locationStatus: number
  avatarImgId: number
  defaultAvatar: boolean
  province: number
  nickname: string
  expertTags: any
  djStatus: number
  avatarUrl: string
  accountType: number
  authStatus: number
  vipType: number
  userName: string
  followed: boolean
  userId: number
  lastLoginIP: string
  lastLoginTime: number
  authenticationTypes: number
  mutual: boolean
  createTime: number
  anchor: boolean
  authority: number
  backgroundImgId: number
  userType: number
  experts: any
  avatarDetail: AvatarDetail
}

export interface AvatarDetail {
  userType: number
  identityLevel: number
  identityIconUrl: string
}
