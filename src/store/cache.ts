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

  function setupCache() {
    uni.setStorage({
      key: 'collectSongs',
      data: collectSongs,
      fail(err) { console.error(err) }
    })

    uni.setStorage({
      key: 'collectPlaylist',
      data: collectPlaylist,
      fail(err) { console.error(err) }
    })

    uni.setStorage({
      key: 'collectAlbums',
      data: collectAlbums,
      fail(err) { console.error(err) }
    })

    uni.setStorage({
      key: 'historySearch',
      data: historySearch,
      fail(err) { console.error(err) }
    })

    uni.setStorage({
      key: 'collectArtists',
      data: collectArtists,
      fail(err) { console.error(err) }
    })
  }

  uni.getStorage({
    key: 'collectSongs',
    success({ data }) { data && collectSongs.push(...data) },
    fail(err) { console.error(err) }
  })

  uni.getStorage({
    key: 'collectPlaylist',
    success({ data }) { data && collectPlaylist.push(...data) },
    fail(err) { console.error(err) }
  })

  uni.getStorage({
    key: 'historySearch',
    success({ data }) { data && historySearch.push(...data) },
    fail(err) { console.error(err) }
  })

  uni.getStorage({
    key: 'collectAlbums',
    success({ data }) { data && collectAlbums.push(...data) },
    fail(err) { console.error(err) }
  })

  uni.getStorage({
    key: 'collectArtists',
    success({ data }) { data && collectArtists.push(...data) },
    fail(err) { console.error(err) }
  })

  audioStore.value.$onAction(({ name, after }) => {
    // * 添加历史播放歌曲
    after(() => {
      const { currentSongIndex, songs } = audioStore.value
      if (!songs.length) return

      switch (name) {
        case 'setPreSong':
        case 'setNextSong':
        case 'setCurrentSong': historyPlays.unshift(songs[currentSongIndex])
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
    addHistorySearch,
    setupCache
  }
})
