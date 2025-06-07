<template>
  <view class="will-change-contents w-[140rpx] leading-[110rpx] text-grey-1 font-bold text-[48rpx]">{{ transTime(audioStore.duration, audioStore.currentTime) }}</view>
</template>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>
// #endif

<script setup lang="ts">
const audioStore = useAudioStore()

function transTime(duration: number, currentTime: number) {
  const time = Math.floor(duration - currentTime)
  if (!time || time < 0) return '00:00'

  let m = Math.floor(time / 60) + ''
  let s = time % 60 + ''
  m.length === 1 && (m = '0' + m)
  s.length === 1 && (s = '0' + s)

  return m + ':' + s
}
</script>
