import request from '@/utils/request'
import type { SongUrlResponse } from '@/api/interface/SongUrl'
import type { LyricResponse } from '@/api/interface/Lyric'

// * 获取歌曲url
export function getSongUrl(id: number) {
  return request.get<SongUrlResponse>(`/song/url?id=${id}`)
}

// * 获取歌曲歌词
export function getLyric(id: number) {
  return request.get<LyricResponse>(`/lyric?id=${id}`)
}
