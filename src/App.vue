<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
  setupLogin()
  setupAudio()
})

onHide(() => {
  setupCache()
})
</script>

<style>
@import '@/styles/index.css';
</style>
