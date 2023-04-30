<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style>
@import '@/styles/index.scss';

@import '@/styles/iconfont/iconfont.css';

#app{
  background-color: #1a191b;
}
</style>
