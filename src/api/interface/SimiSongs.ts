export interface SimiSongsResponse {
  songs: Song[]
  code: number
}

export interface Song {
  starred: boolean
  popularity: number
  starredNum: number
  playedNum: number
  dayPlays: number
  hearTime: number
  mp3Url: string
  rtUrls: any
  mark: number
  noCopyrightRcmd: any
  originCoverType: number
  originSongSimpleData: any
  songJumpInfo: any
  crbt: any
  rtUrl: any
  ftype: number
  audition: any
  copyFrom: string
  ringtone?: string
  disc: string
  no: number
  fee: number
  rtype: number
  rurl: any
  alias: string[]
  artists: Artist[]
  copyrightId: number
  album: Album
  score: number
  hMusic?: HMusic
  mMusic?: MMusic
  lMusic: LMusic
  commentThreadId: string
  mvid: number
  bMusic: BMusic
  sqMusic?: SqMusic
  hrMusic?: HrMusic
  position: number
  duration: number
  status: number
  name: string
  id: number
  recommendReason: string
  privilege: Privilege
  alg: string
  transNames?: string[]
}

export interface Artist {
  img1v1Id: number
  topicPerson: number
  musicSize: number
  albumSize: number
  briefDesc: string
  alias: any[]
  picId: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  trans: string
  name: string
  id: number
  img1v1Id_str: string
}

export interface Album {
  songs: any[]
  paid: boolean
  onSale: boolean
  mark: number
  awardTags: any
  companyId: number
  blurPicUrl: string
  pic: number
  briefDesc: string
  publishTime: number
  company: string
  alias: string[]
  artists: Artist2[]
  copyrightId: number
  picId: number
  artist: Artist3
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

export interface Artist2 {
  img1v1Id: number
  topicPerson: number
  musicSize: number
  albumSize: number
  briefDesc: string
  alias: any[]
  picId: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  trans: string
  name: string
  id: number
  img1v1Id_str: string
}

export interface Artist3 {
  img1v1Id: number
  topicPerson: number
  musicSize: number
  albumSize: number
  briefDesc: string
  alias: any[]
  picId: number
  picUrl: string
  img1v1Url: string
  followed: boolean
  trans: string
  name: string
  id: number
  img1v1Id_str: string
}

export interface HMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface MMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface LMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface BMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface SqMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface HrMusic {
  volumeDelta: number
  bitrate: number
  playTime: number
  dfsId: number
  sr: number
  name: string
  id: number
  size: number
  extension: string
}

export interface Privilege {
  id: number
  fee: number
  payed: number
  st: number
  pl: number
  dl: number
  sp: number
  cp: number
  subp: number
  cs: boolean
  maxbr: number
  fl: number
  toast: boolean
  flag: number
  preSell: boolean
  playMaxbr: number
  downloadMaxbr: number
  maxBrLevel: string
  playMaxBrLevel: string
  downloadMaxBrLevel: string
  plLevel: string
  dlLevel: string
  flLevel: string
  rscl: any
  freeTrialPrivilege: FreeTrialPrivilege
  chargeInfoList: ChargeInfoList[]
}

export interface FreeTrialPrivilege {
  resConsumable: boolean
  userConsumable: boolean
  listenType: any
}

export interface ChargeInfoList {
  rate: number
  chargeUrl: any
  chargeMessage: any
  chargeType: number
}
