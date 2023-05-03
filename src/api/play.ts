import request from '@/utils/request'
import type { SongURLResponse } from '@/api/interface/SongURL'
import type { LyricResponse } from '@/api/interface/Lyric'

// * 获取歌曲url
export function getSongURL(id: number) {
  return request.get<any, SongURLResponse>(`/song/url?id=${id}`)
}

// * 获取歌曲歌词
export function getLyric(id: number) {
  return request.get<any, LyricResponse>(`/lyric?id=${id}`)
}
