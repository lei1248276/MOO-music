import request from '@/utils/request'
import type { NewMVResponse } from './interface/NewMV'
import type { MVDetailResponse } from './interface/MVDetail'
import type { MVurlResponse } from './interface/MVurl'

/**
 * @description 获取最新 MV
 */
export function getNewMV(limit: number = 30) {
  return request.get<any, NewMVResponse>(`/mv/first?limit=${limit}`)
}

/**
 * @description 获取 MV 详情
 */
export function getMVDetail(id: number) {
  return request.get<any, MVDetailResponse>(`/mv/detail?mvid=${id}`)
}

/**
 * @description 获取 MV url
 */
export function getMVurl(id: number) {
  return request.get<any, MVurlResponse>(`/mv/url?id=${id}`)
}
