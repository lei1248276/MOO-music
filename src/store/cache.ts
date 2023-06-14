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
    addHistorySearch
  }
})
