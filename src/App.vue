<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
  uni.getStorage({
    key: 'cookie',
    success(res) { if (res.data) useUserStore().login(res.data) }
  })
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
