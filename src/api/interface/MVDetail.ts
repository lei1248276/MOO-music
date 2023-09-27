export interface MVDetailResponse {
  loadingPic: string
  bufferPic: string
  loadingPicFS: string
  bufferPicFS: string
  subed: boolean
  mp: {
    id: number
    fee: number
    mvFee: number
    payed: number
    pl: number
    dl: number
    cp: number
    sid: number
    st: number
    normal: boolean
    unauthorized: boolean
    msg: any
  }
  data: {
    id: number
    name: string
    artistId: number
    artistName: string
    briefDesc: string
    desc: string
    cover: string
    coverId_str: string
    coverId: number
    playCount: number
    subCount: number
    shareCount: number
    commentCount: number
    duration: number
    nType: number
    publishTime: string
    price: any
    brs: Array<{
      size: number
      br: number
      point: number
    }>
    artists: Array<{
      id: number
      name: string
      img1v1Url: string
      followed: boolean
    }>
    commentThreadId: string
    videoGroup: Array<any>
  }
  code: number
}
