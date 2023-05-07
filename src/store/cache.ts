import type { Song } from '@/api/interface/Song'
import type { Playlist } from '@/api/interface/Playlist'

export const useCacheStore = defineStore('cache', () => {
  const historyPlays = shallowReactive<Song[]>([])
  const collectSongs = shallowReactive<Song[]>([])
  const collectPlaylist = shallowReactive<Playlist[]>([])

  return {
    historyPlays,
    collectSongs,
    collectPlaylist
  }
})
