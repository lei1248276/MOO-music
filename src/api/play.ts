import request from '@/utils/request'
import { MOO_API } from '@/utils/request'
import type { SongURLResponse } from './interface/SongURL'
import type { LyricResponse } from './interface/Lyric'
import type { SimiSongsResponse } from './interface/SimiSongs'

/**
 * @description 获取歌曲url
 * @param id 音乐id
 * @param level 播放音质等级, 分为 standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res, jyeffect => 高清环绕声, sky => 沉浸环绕声, jymaster => 超清母带
 */
export function getSongURL(id: number, level: 'standard' | 'higher' | 'exhigh' | 'lossless' | 'hires' | 'jyeffect' | 'sky' | 'jymaster' = 'standard') {
  return request.get<any, SongURLResponse>(`${MOO_API}/song/url/v1?id=${id}&level=${level}`,
    {
    // #ifdef MP-WEIXIN
      header: { cookie: uni.getStorageSync('cookie') || '' }
    // #endif
    })
}

/**
 * @description 获取歌曲歌词
 * @param id 歌曲id
 */
export function getLyric(id: number) {
  return request.get<any, LyricResponse>(`/lyric?id=${id}`)
}

/**
 * @description 获取相似歌曲
 * @param id 歌曲id
 */
export function getSimiSongs(id: number) {
  return request.get<any, SimiSongsResponse>(`/simi/song?id=${id}`)
}
