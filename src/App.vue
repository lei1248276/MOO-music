<script setup lang="ts">
import { setupAudio } from './store/audio'
const cacheStore = useCacheStore()

onLaunch(() => {
  console.log('App Launch')
  setupAudio()
})

onHide(() => {
  cacheStore.setupCache()
})
</script>

<style>
@import '@/styles/index.scss';
</style>
