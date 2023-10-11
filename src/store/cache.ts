import type { Song } from '@/components/Song/Song.vue'
import type { Playlist } from '@/api/interface/Playlist'
import type { Album } from '@/components/Album/Album.vue'
import type { Artist } from '@/components/Artist/Artist.vue'

export const useCacheStore = defineStore('cache', () => {
  const audioStore = useAudioStore()

  const historySearch = useCache('historySearch', shallowReactive<string[]>([]))
  const historyPlays = useCache('historyPlays', shallowReactive<Song[]>([]))
  const collectSongs = useCache('collectSongs', shallowReactive<Song[]>([]))
  const collectPlaylist = useCache('collectPlaylist', shallowReactive<Playlist[]>([]))
  const collectAlbums = useCache('collectAlbums', shallowReactive<Album[]>([]))
  const collectArtists = useCache('collectArtists', shallowReactive<Artist[]>([]))

  function addHistorySearch(keyword: string) {
    const index = historySearch.findIndex(v => v === keyword)
    index === -1
      ? historySearch.unshift(keyword)
      : historySearch.unshift(...historySearch.splice(index, 1))

    // * 超过10个就丢弃
    if (historySearch.length > 10) historySearch.length = 10
  }

  // * 添加历史播放歌曲
  watch(() => audioStore.currentSongInfo, songInfo => {
    console.log('🚀 ~ file: cache.ts:51 ~ watch ~ songInfo:', '添加历史播放歌曲')
    if (!songInfo) return

    const { song } = songInfo
    const index = historyPlays.findIndex(v => v.id === song.id)
    index === -1
      ? historyPlays.unshift(song)
      : historyPlays.unshift(...historyPlays.splice(index, 1))

    // * 超过50个就丢弃
    if (historyPlays.length > 50) historyPlays.length = 50
  })

  return {
    historySearch,
    historyPlays,
    collectSongs,
    collectPlaylist,
    collectAlbums,
    collectArtists,
    addHistorySearch
  }
})
