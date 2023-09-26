<template>
  <slider
    :value="audioStore.currentTime / audioStore.duration * 100"
    :step="0.5"
    active-color="#fff"
    background-color="rgba(255,255,255,.3)"
    block-color="transparent"
    :block-size="20"
    class="progress x-mid bottom-[18%] w-4/5 m-0 scale-y-[2.0] duration-300 transition-transform"
    :class="{'!scale-y-[3.5] !duration-500 !rounded-full': isTouch}"
    @changing="onChanging"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import type { SliderOnChangingEvent, SliderOnChangeEvent } from '@uni-helper/uni-app-types'

const audioStore = useAudioStore()

const isTouch = ref(false)

function onChanging({ detail: { value }}: SliderOnChangingEvent) {
  !isTouch.value && (isTouch.value = true)

  audioStore.isPlay && audioStore.audio.pause()

  audioStore.currentTime = value / 100 * audioStore.duration
}

function onChange({ detail: { value }}: SliderOnChangeEvent) {
  isTouch.value = false
  audioStore.currentTime = value / 100 * audioStore.duration
  ;(audioStore.audio.seek(audioStore.currentTime), audioStore.audio.play())
}
</script>

<style lang="scss">
.progress :deep(.uni-slider-thumb){
  box-shadow: none !important;
}
</style>
