import request from '@/utils/request'
import type { ArtistResponse } from './interface/Artist'
import type { ArtistSongsResponse } from './interface/ArtistSongs'
import type { ArtistAlbumsResponse } from './interface/ArtistAlbums'

/**
 * @description 获取歌手详情
 * @param id 歌手ID
 */
export function getArtistDetail(id: number) {
  return request.get<any, ArtistResponse>(`/artist/detail?id=${id}`)
}

/**
 * @description 获取歌手歌曲
 * @param id 歌手ID
 */
export function getArtistSongs(id: number) {
  return request.get<any, ArtistSongsResponse>(`/artists?id=${id}`)
}

/**
 * @description 获取歌手专辑
 * @param id 歌手ID
 */
export function getArtistAlbums(id: number) {
  return request.get<any, ArtistAlbumsResponse>(`/artist/album?id=${id}`)
}
