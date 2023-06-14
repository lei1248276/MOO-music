import request from '@/utils/request'
import type { TopArtistsResponse } from './interface/TopArtists'
import type { TopSearchResponse } from './interface/TopSearch'
import type { SearchResponse } from './interface/Search'
import type { SearchSuggestResponse } from './interface/SearchSuggest'

// * 获取热门歌手数据
export function getTopArtists(offset = 0, limit = 30) {
  return request.get<any, TopArtistsResponse>(`/top/artists?offset=${offset}&limit=${limit}`)
}

// * 获取热门搜索列表
export function getTopSearch() {
  return request.get<any, TopSearchResponse>(`/search/hot`)
}

// * 获取搜索结果
/**
 * @param type 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
 */
export function getSearch(keywords: string, type = 1, offset = 0, limit = 30) {
  return request.get<any, SearchResponse>(`/search?keywords=${keywords}&offset=${offset}&limit=${limit}&type=${type}`)
}

// * 获取搜索建议
/**
 * @description 说明 : 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息
 */
export function getSearchSuggest(keywords: string, type = 'mobile') {
  return request.get<any, SearchSuggestResponse>(`/search/suggest?keywords=${keywords}&type=${type}`)
}
