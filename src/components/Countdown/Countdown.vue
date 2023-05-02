<template>
  <view class="text-grey-1 font-bold text-[48rpx]">{{ minute }}:{{ seconds }}</view>
</template>

<script setup lang="ts">
const audioStore = useAudioStore()

const minute = ref('00')
const seconds = ref('00')

watch(() => audioStore.currentTime, () => {
  if (!audioStore.duration) return

  const time = Math.floor(audioStore.duration - audioStore.currentTime)
  let m = Math.floor(time / 60) + ''
  let s = time % 60 + ''
  m.length === 1 && (m = '0' + m)
  s.length === 1 && (s = '0' + s)

  if (s === seconds.value) return
  // console.log({ time, m, s })

  minute.value = m
  seconds.value = s
})
</script>
