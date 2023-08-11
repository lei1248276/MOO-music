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
  const historySearch = shallowReactive<string[]>([])
  const historyPlays = shallowReactive<Song[]>([])
  const collectSongs = shallowReactive<Song[]>([])
  const collectPlaylist = shallowReactive<Playlist[]>([])
  const collectAlbums = shallowReactive<Album[]>([])
  const collectArtists = shallowReactive<Artist[]>([])

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

export function useCache() {
  const cacheStore = useCacheStore()

  uni.getStorageInfo({
    success(res) {
      res.keys.forEach(key => {
        const cacheList = cacheStore[key as keyof typeof cacheStore]
        if (!cacheList) return

        uni.getStorage({
          key,
          success({ data }) {
            if (data && Array.isArray(cacheList)) {
              // @ts-ignore
              data.forEach((v, i) => { cacheList[i] = v })
            }
          },
          fail(err) { console.error(err) }
        })
      })
    }
  })
}

export function setupCache() {
  const cacheStore = useCacheStore()
  const keys = [
    'historyPlays',
    'historySearch',
    'collectSongs',
    'collectPlaylist',
    'collectAlbums',
    'collectArtists'
  ]

  keys.forEach((key) => {
    uni.setStorage({
      key,
      data: cacheStore[key as keyof typeof cacheStore],
      fail(err) { console.error(err) }
    })
  })
}
