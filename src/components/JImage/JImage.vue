<template>
  <view
    class="overflow-hidden"
    :style="{ width, height, 'border-radius': radius }"
  >
    <view
      v-if="!loaded"
      class="alt w-full h-full"
    />

    <image
      v-if="!lazyLoad || loading || loaded"
      class="w-full h-full"
      :style="{ transition: 'opacity 1s', opacity: loaded ? 1 : 0 }"
      :src="src"
      :mode="mode"
      :fade-show="fadeShow"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      :draggable="draggable"
      @load="() => loaded = true"
    />
  </view>
</template>

<script setup lang="ts">
import type { ImageProps } from '@uni-helper/uni-app-types'
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
}

const props = withDefaults(defineProps<ImgProps>(), {
  radius: '0',
  lazyLoad: false,
  mode: 'scaleToFill',
  fadeShow: true,
  webp: false,
  showMenuByLongpress: false,
  draggable: true
})

const loading = ref(false)
const loaded = ref(false)

onMounted(() => {
  if (!props.lazyLoad) return

  const observer = uni.createIntersectionObserver(getCurrentInstance()?.proxy)
  observer.relativeToViewport({ bottom: 100 }).observe(`.alt`, (res) => {
    if (res.intersectionRatio === 0) return

    loading.value = true
    // console.log('🚀', res.intersectionRatio)
    observer?.disconnect()
  })
})
</script>
