export interface RecommendResponse {
  hasTaste: boolean
  code: number
  category: number
  result?: Recommend[]
  recommend?: Recommend[]
}

export interface Recommend {
  id: number
  type: number
  name: string
  copywriter: string
  picUrl: string
  canDislike: boolean
  trackNumberUpdateTime: number
  playCount: number
  trackCount: number
  highQuality: boolean
  alg: string
}
