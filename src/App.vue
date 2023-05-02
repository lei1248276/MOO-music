<script setup lang="ts">
import toast from './utils/toast'

const audioStore = useAudioStore()

onLaunch(() => {
  console.log('App Launch')
  const audio = audioStore.audio
  // @ts-ignore
  audio.autoplay = true

  audio.onCanplay(() => {
    console.log('onCanplay.duration: ', audio.duration)
    audioStore.duration = audio.duration
  })

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
</script>

<style>
@import '@/styles/index.scss';

@import '@/styles/iconfont/iconfont.css';

page{
  min-height: 100vh;
  background-color: #1a191b !important;
}
</style>
