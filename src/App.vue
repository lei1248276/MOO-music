<script setup lang="ts">
const audioStore = useAudioStore()
const cacheStore = useCacheStore()

onLaunch(() => {
  console.log('App Launch')
  audioStore.setupAudio()
})

onHide(() => {
  cacheStore.setupCache()
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
