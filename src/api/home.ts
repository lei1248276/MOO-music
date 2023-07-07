import request from '@/utils/request'
import type { BannerResponse } from '@/api/interface/Banner'
import type { RecommendResponse } from '@/api/interface/Recommend'
import type { NewAlbumResponse } from '@/api/interface/NewAlbum'
import type { SonglistResponse } from '@/api/interface/Songlist'

export { getPlaylist } from '@/api/playlist'

// * 获取轮播图（0: pc 1: android 2: iphone 3: ipad）
export function getBanner(type: 0 | 1 | 2 | 3 = 1) {
  return request.get<any, BannerResponse>(`/banner?type=${type}`)
}

// * 获取推荐歌单
export function getRecommend(limit: number) {
  return request.get<any, RecommendResponse>(`/personalized?limit=${limit}`)
}

// * 获取新歌单
export function getNewSonglist(offset: number, limit: number) {
  return request.get<any, SonglistResponse>(`/top/playlist?limit=${limit}&order=hot&offset=${offset}`)
}

// * 获取新歌
export function getNewSong() {
  return request.get(`/personalized/newsong`)
}

// * 获取新专辑
export function getNewAlbum() {
  return request.get<any, NewAlbumResponse>(`/album/newest`)
}
