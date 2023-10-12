<template>
  <view
    class="relative overflow-hidden"
    :class="{'before:absolute before:z-50 before:alt before:animate-pulse': !loaded}"
    :style="{width, height, 'border-radius': radius}"
    @click="$emit('click')"
  >
    <image
      class="j-image w-full h-full transition-opacity duration-1000"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      :src="(!lazyLoad || loading || loaded) ? transHTTPS(src) : ''"
      :mode="mode"
      :fade-show="fadeShow"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      :draggable="draggable"
      @load="loaded = true"
    />
  </view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup lang="ts">
import type { ImageProps } from '@uni-helper/uni-app-types'
import { transHTTPS } from '@/utils/util'

interface ImgProps extends ImageProps {
  src: string
  width?: string
  height?: string
  radius?: string
  lazyLoad?: boolean
  mode?: ImageProps['mode']
  webp?: ImageProps['webp']
  fadeShow?: ImageProps['fadeShow']
  showMenuByLongpress?: ImageProps['showMenuByLongpress']
  draggable?: ImageProps['draggable']
}

const props = withDefaults(defineProps<ImgProps>(), {
  width: '100%',
  height: '100%',
  radius: '0',
  lazyLoad: false,
  mode: 'scaleToFill',
  fadeShow: true,
  webp: false,
  showMenuByLongpress: false,
  draggable: true
})
defineEmits(['click'])

const loading = ref(false)
const loaded = ref(false)

let observer: ReturnType<typeof uni.createIntersectionObserver> | undefined
onMounted(() => {
  if (!props.lazyLoad) return

  observer = uni.createIntersectionObserver(getCurrentInstance()?.proxy)
  observer.relativeToViewport({ bottom: 100 }).observe(`.j-image`, (res) => {
    if (res.intersectionRatio === 0) return

    loading.value = true
    observer?.disconnect()
  })
})
onUnmounted(() => {
  observer?.disconnect()
})
</script>
