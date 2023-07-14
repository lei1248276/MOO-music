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
</style>
