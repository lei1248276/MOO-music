<template>
  <view
    class="overflow-hidden"
    :class="customClass"
    :style="{ width, height, 'border-radius': radius }"
    @click="$emit('click')"
  >
    <view
      v-if="!loaded"
      class="relative alt w-full h-full before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 animate-pulse"
    />

    <image
      v-if="!lazyLoad || loading || loaded"
      class="w-full h-full transition-opacity duration-1000"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      :src="transHTTPS(src)"
      :mode="mode"
      :fade-show="fadeShow"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      :draggable="draggable"
      @load="loaded = true"
    />
  </view>
</template>

<script setup lang="ts">
import type { ImageProps } from '@uni-helper/uni-app-types'
import { transHTTPS } from '@/utils/util'

interface ImgProps extends ImageProps {
  src: string
  width: string
  height: string
  radius?: string
  lazyLoad?: boolean
  mode?: ImageProps['mode']
  webp?: ImageProps['webp']
  fadeShow?: ImageProps['fadeShow']
  showMenuByLongpress?: ImageProps['showMenuByLongpress']
  draggable?: ImageProps['draggable']
  customClass?: string
}

const props = withDefaults(defineProps<ImgProps>(), {
  radius: '0',
  lazyLoad: false,
  mode: 'scaleToFill',
  fadeShow: true,
  webp: false,
  showMenuByLongpress: false,
  draggable: true,
  customClass: ''
})
defineEmits(['click'])

const loading = ref(false)
const loaded = ref(false)

let observer: ReturnType<typeof uni.createIntersectionObserver> | undefined
onMounted(() => {
  if (!props.lazyLoad) return

  observer = uni.createIntersectionObserver(getCurrentInstance()?.proxy)
  observer.relativeToViewport({ bottom: 100 }).observe(`.alt`, (res) => {
    if (res.intersectionRatio === 0) return

    loading.value = true
    // console.log('🚀', res.intersectionRatio)
    observer?.disconnect()
  })
})
onUnmounted(() => {
  observer?.disconnect()
})
</script>
