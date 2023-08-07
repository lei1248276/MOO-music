<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
  setupAudio()
  useCache()
})

onHide(() => {
  setupCache()
})
</script>

<style>
@import '@/styles/index.css';
</style>
