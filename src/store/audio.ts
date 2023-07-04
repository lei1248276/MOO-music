import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'
import type { SongURL } from '@/api/interface/SongURL'
import { getSongURL } from '@/api/play'
import toast from '@/utils/toast'
import { transHTTPS } from '@/utils/util'

interface SongInfo {
  song: Song
  urlInfo: SongURL
}

// * 懒加载：使用时再进行重写
const cacheStore: {value: ReturnType<typeof useCacheStore>} = {
  get value() {
    // @ts-ignore
    delete this.value
    return (this.value = useCacheStore())
  }
}

export const useAudioStore = defineStore('audio', () => {
  const audio = markRaw(uni.getBackgroundAudioManager?.() || uni.createInnerAudioContext())
  const isLoading = ref(false) // * 是否缓冲中
  const isPlay = ref(false)
  const duration = ref(0) // * 当前歌曲时长
  const currentTime = ref(0) // * 当前歌曲播放时间

  const playlist = shallowRef<Playlist>()
  const songs = shallowRef<Song[]>([])
  const currentSongInfo = shallowRef<SongInfo>()
  const currentSongIndex = ref(-1)

  function setPreSong() {
    if (!songs.value.length) return

    const last = songs.value.length - 1
    const currentIndex = currentSongIndex.value
    const preIndex = currentIndex === 0 ? last : currentIndex - 1
    setCurrentSong(songs.value[preIndex], preIndex)
  }

  function setNextSong() {
    if (!songs.value.length) return

    const last = songs.value.length - 1
    const currentIndex = currentSongIndex.value
    const nextIndex = currentIndex === last ? 0 : currentIndex + 1
    setCurrentSong(songs.value[nextIndex], nextIndex)
  }

  async function setCurrentSong(song: Song, index: number) {
    if (currentSongInfo.value?.song.id === song.id) return (audio.seek(0), audio.play())

    try {
      isLoading.value = true
      currentSongIndex.value = index
      const { data: [urlInfo] } = await getSongURL(song.id)
      console.log('🚀 ~ file: audio.ts:58 ~ setCurrentSong ~ urlInfo:', urlInfo)

      if (!urlInfo.url) throw new Error('播放地址失效')

      currentSongInfo.value = { song, urlInfo }
      audio.title = song.name
      audio.epname = song.al.name
      audio.singer = song.ar.reduce((acc, { name }) => (acc += name + '. '), '')
      audio.coverImgUrl = song.al.picUrl
      audio.src = transHTTPS(urlInfo.url)

      // * 添加历史播放歌曲
      if (songs.value !== cacheStore.value.historyPlays) cacheStore.value.historyPlays.unshift(song)
    } catch (error) {
      (audio.pause(), toast.fail('播放地址失效'))
      currentSongInfo.value = undefined
      isLoading.value = false
      isPlay.value = false
      duration.value = 0
    }
  }

  function toggle() {
    if (!currentSongInfo.value) return

    isPlay.value ? audio.pause() : audio.play()
  }

  return {
    audio,
    isLoading,
    isPlay,
    duration,
    currentTime,
    playlist,
    songs,
    currentSongInfo,
    currentSongIndex,
    setPreSong,
    setCurrentSong,
    setNextSong,
    toggle
  }
})
