<template>
  <view
    class="Image-wrapper overflow-hidden"
    :style="{ width, height, 'border-radius': radius }"
  >
    <view
      v-if="!loaded"
      class="alt w-full h-full"
    />

    <image
      v-if="loading || passive || loaded"
      :style="{ width, height, transition: 'opacity 1s', opacity: loaded ? 1 : 0 }"
      v-bind="$attrs"
      mode="scaleToFill"
      @load="() => loaded = true"
    />
  </view>
</template>

<script setup lang="ts">
import type { ImageProps } from '@uni-helper/uni-app-types'
interface ImgProps extends ImageProps {
  width: string
  height: string
  radius?: string
  passive?: boolean // * 控制是否被动执行懒加载（组件默认是执行懒加载）
}

const props = withDefaults(defineProps<ImgProps>(), {
  radius: '0',
  passive: false
})

const loading = ref(false)
const loaded = ref(false)

onMounted(() => {
  if (props.passive) return

  const observer = uni.createIntersectionObserver(getCurrentInstance()?.proxy)
  observer.relativeToViewport({ bottom: 100 }).observe(`.alt`, (res) => {
    if (res.intersectionRatio === 0) return

    loading.value = true
    // console.log('🚀', res.intersectionRatio)
    observer?.disconnect()
  })
})
</script>
