<script setup lang="ts">
import toast from './utils/toast'

const audioStore = useAudioStore()
const cacheStore = useCacheStore()

onLaunch(() => {
  console.log('App Launch')
  const audio = audioStore.audio
  // @ts-ignore
  audio.autoplay = true

  // * 小程序的BUG：需要多次获取
  function getDuration() {
    if (!audio.duration) return setTimeout(() => { getDuration() }, 333)

    console.log('onCanplay.duration: ', audio.duration)
    audioStore.$patch((state) => {
      state.isLoading = false
      state.duration = audio.duration
      audio.play()
    })
  }
  audio.onCanplay(getDuration)

  audio.onPlay(() => {
    console.log('onPlay: ')
    audioStore.isPlay = true
  })

  audio.onPause(() => {
    console.log('onPause: ')
    audioStore.isPlay = false
  })

  audio.onEnded(() => {
    console.log('onEnded: ')
    audioStore.setNextSong()
  })

  audio.onTimeUpdate(() => {
    audioStore.currentTime = audio.currentTime
  })

  audio.onNext?.(() => {
    console.log('onNext: ')
    audioStore.setNextSong()
  })

  audio.onPrev?.(() => {
    console.log('onPrev: ')
    audioStore.setPreSong()
  })

  audio.onError((err) => {
    toast.fail('链接无效')
    console.error(err)
    audioStore.$patch((state) => {
      state.isLoading = false
      state.isPlay = false
    })
  })
})

onHide(() => {
  cacheStore.setCollectSongs()
  cacheStore.setCollectPlaylist()
  cacheStore.setHistorySearch()
})
</script>

<style>
@import '@/styles/index.scss';

@import '@/styles/iconfont/iconfont.css';

page{
  width: 100%;
  height: 100%;
  background-color: #1a191b !important;
}
</style>
