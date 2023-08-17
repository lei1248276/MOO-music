import { MOO_API } from './../utils/request'
import request from '@/utils/request'
import type { UserPlaylistResponse } from './interface/UserPlaylist'
import type { UserSubcountResponse } from './interface/UserSubcount'

// * 获取用户歌单列表
export function getUserPlaylist(uid: number, offset = 0, limit = 30) {
  return request.get<any, UserPlaylistResponse>(`/user/playlist?uid=${uid}&offset=${offset}&limit=${limit}`)
}

/**
 * @description 获取用户信息 , 歌单，收藏，mv, dj 数量 (需要先登录)
 */

export function getUserSubcount() {
  return request.get<any, UserSubcountResponse>(`${MOO_API}/user/subcount?timestamp=${Date.now()}`,
    {
      // #ifdef MP-WEIXIN
      header: { cookie: uni.getStorageSync('cookie') || '' }
      // #endif
    })
}
