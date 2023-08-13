import type { Song } from '@/components/Song/Song.vue'
import type { Playlist } from '@/api/interface/Playlist'
import type { Album } from '@/components/Album/Album.vue'
import type { Artist } from '@/components/Artist/Artist.vue'

const audioStore: {value: ReturnType<typeof useAudioStore>} = {
  get value() {
    // @ts-ignore
    delete this.value
    return (this.value = useAudioStore())
  }
}

export const useCacheStore = defineStore('cache', () => {
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

  audioStore.value.$onAction(({ name, after }) => {
    // * 添加历史播放歌曲
    after(() => {
      const { currentSongIndex, songs } = audioStore.value
      if (!songs.length) return

      switch (name) {
        case 'setPreSong':
        case 'setNextSong':
        case 'setCurrentSong': {
          const song = songs[currentSongIndex]
          const index = historyPlays.findIndex(v => v.id === song.id)
          index === -1
            ? historyPlays.unshift(song)
            : historyPlays.unshift(...historyPlays.splice(index, 1))

          // * 超过50个就丢弃
          if (historyPlays.length > 50) historyPlays.length = 50
        }
      }
    })
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

export function setupCache() {
  const cacheStore = useCacheStore()
  const audioStore = useAudioStore()
  const keys = [
    'historyPlays',
    'historySearch',
    'collectSongs',
    'collectPlaylist',
    'collectAlbums',
    'collectArtists',
    'mode',
    'playlist',
    'songs'
  ]

  keys.forEach((key) => {
    uni.setStorage({
      key,
      data: key in cacheStore
        ? cacheStore[key as keyof typeof cacheStore]
        : audioStore[key as keyof typeof audioStore],
      fail(err) { console.error(err) }
    })
  })
}
