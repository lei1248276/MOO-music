export interface UserPlaylistResponse {
  version: string
  more: boolean
  playlist: Playlist[]
  code: number
}

export interface Playlist {
  subscribers: any[]
  subscribed: boolean
  creator: Creator
  artists: any
  tracks: any
  updateFrequency: any
  backgroundCoverId: number
  backgroundCoverUrl: any
  titleImage: number
  titleImageUrl: any
  englishTitle: any
  opRecommend: boolean
  recommendInfo: any
  subscribedCount: number
  cloudTrackCount: number
  userId: number
  totalDuration: number
  coverImgId: number
  privacy: number
  trackUpdateTime: number
  trackCount: number
  updateTime: number
  commentThreadId: string
  coverImgUrl: string
  specialType: number
  anonimous: boolean
  createTime: number
  highQuality: boolean
  newImported: boolean
  trackNumberUpdateTime: number
  playCount: number
  adType: number
  description?: string
  tags: string[]
  ordered: boolean
  status: number
  name: string
  id: number
  coverImgId_str?: string
  sharedUsers: any
  shareStatus: any
  copied: boolean
}

export interface Creator {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags: any
  experts: any
  djStatus: number
  vipType: number
  remarkName: any
  authenticationTypes: number
  avatarDetail: any
  avatarImgIdStr: string
  backgroundImgIdStr: string
  anchor: boolean
  avatarImgId_str: string
}
