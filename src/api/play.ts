import request from '@/utils/request'
import { MOO_API } from '@/utils/request'
import type { SongURLResponse } from '@/api/interface/SongURL'
import type { LyricResponse } from '@/api/interface/Lyric'

// * 获取歌曲url
export function getSongURL(id: number) {
  return request.get<any, SongURLResponse>(`${MOO_API}/song/url/v1?id=${id}&level=lossless`,
    {
    // #ifdef MP-WEIXIN
      header: { cookie: uni.getStorageSync('cookie') || '' }
    // #endif
    })
}

// * 获取歌曲歌词
export function getLyric(id: number) {
  return request.get<any, LyricResponse>(`/lyric?id=${id}`)
}
