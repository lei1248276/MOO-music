import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'
import type { SongURL } from '@/api/interface/SongURL'
import { getSongURL } from '@/api/play'
import toast from '@/utils/toast'

interface SongInfo {
  song: Song
  urlInfo: SongURL
}

export const useAudioStore = defineStore('audio', () => {
  const audio = markRaw(uni.getBackgroundAudioManager?.() || uni.createInnerAudioContext())
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
    uni.$emit('onPreSong', preIndex)
  }

  function setNextSong() {
    if (!songs.value.length) return

    const last = songs.value.length - 1
    const currentIndex = currentSongIndex.value
    const nextIndex = currentIndex === last ? 0 : currentIndex + 1
    setCurrentSong(songs.value[nextIndex], nextIndex)
    uni.$emit('onNextSong', nextIndex)
  }

  async function setCurrentSong(song: Song, index: number) {
    if (currentSongInfo.value?.song.id === song.id) return (audio.seek(0), audio.play())

    currentSongIndex.value = index
    const { data: [urlInfo] } = await getSongURL(song.id)
    console.log('🚀 ~ file: audio.ts:58 ~ setCurrentSong ~ urlInfo:', urlInfo)

    if (!urlInfo.url) {
      (audio.stop(), toast.fail('播放地址失效'))
      currentSongInfo.value = undefined
      isPlay.value = false
      duration.value = 0
      return
    }

    currentSongInfo.value = { song, urlInfo }
    audio.title = song.name
    audio.epname = song.al.name
    audio.singer = song.ar.reduce((acc, { name }) => (acc += name + '. '), '')
    audio.coverImgUrl = song.al.picUrl
    audio.src = urlInfo.url
    // cacheStore.setHistoryPlay(song)
  }

  function toggle() {
    if (!currentSongInfo.value) return

    isPlay.value ? audio.pause() : audio.play()
  }

  return {
    audio,
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
