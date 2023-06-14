import type { Song } from '@/api/interface/Song'
import type { Playlist } from '@/api/interface/Playlist'

export const useCacheStore = defineStore('cache', () => {
  const historySearch = shallowReactive<string[]>([])
  const historyPlays = shallowReactive<Song[]>([])
  const collectSongs = shallowReactive<Song[]>([])
  const collectPlaylist = shallowReactive<Playlist[]>([])

  function addHistorySearch(keyword: string) {
    const index = historySearch.findIndex(v => v === keyword)
    index === -1
      ? historySearch.unshift(keyword)
      : historySearch.unshift(...historySearch.splice(index, 1))

    // * 超过10个就丢弃
    if (historySearch.length > 10) historySearch.length = 10
  }

  function setCollectSongs() {
    uni.setStorage({
      key: 'collectSongs',
      data: collectSongs,
      fail(err) { console.error(err) }
    })
  }

  function setCollectPlaylist() {
    uni.setStorage({
      key: 'collectPlaylist',
      data: collectPlaylist,
      fail(err) { console.error(err) }
    })
  }

  function setHistorySearch() {
    uni.setStorage({
      key: 'historySearch',
      data: historySearch,
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

  return {
    historySearch,
    historyPlays,
    collectSongs,
    collectPlaylist,
    addHistorySearch,
    setCollectSongs,
    setCollectPlaylist,
    setHistorySearch
  }
})
