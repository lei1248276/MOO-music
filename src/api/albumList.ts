import request from '@/utils/request'
import type { AlbumListResponse } from '@/api/interface/AlbumList'

/**
 * @description 获取所有专辑
 * @param area : ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param limit : 返回数量 , 默认为 30
 */
export function getAlbumList(area: 'ALL' | 'ZH' | 'EA' | 'KR' | 'JP' = 'ALL', offset = 0, limit = 20) {
  return request.get<any, AlbumListResponse>(`/album/new?area=${area}&offset=${offset}&limit=${limit}`)
}
