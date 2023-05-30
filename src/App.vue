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
    audioStore.duration = audio.duration
    audio.play()
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
  })
})

onShow(() => {
  !cacheStore.collectSongs.length && uni.getStorage({
    key: 'collectSongs',
    success({ data }) { data && cacheStore.collectSongs.push(...data) },
    fail(err) { console.error(err) }
  })
  !cacheStore.collectPlaylist.length && uni.getStorage({
    key: 'collectPlaylist',
    success({ data }) { data && cacheStore.collectPlaylist.push(...data) },
    fail(err) { console.error(err) }
  })
})
onHide(() => {
  uni.setStorage({
    key: 'collectSongs',
    data: cacheStore.collectSongs,
    fail(err) { console.error(err) }
  })
  uni.setStorage({
    key: 'collectPlaylist',
    data: cacheStore.collectPlaylist,
    fail(err) { console.error(err) }
  })
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
