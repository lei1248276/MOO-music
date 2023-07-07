import request from '@/utils/request'
import type { AlbumResponse } from '@/api/interface/Album'

// * 获取专辑内容
export function getAlbumDetail(id: number) {
  return request.get<any, AlbumResponse>(`/album?id=${id}`)
}
