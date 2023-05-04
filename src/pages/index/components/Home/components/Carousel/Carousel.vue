<template>
  <view>
    <swiper
      class="carousel rounded-[14rpx] overflow-hidden"
      :autoplay="autoplay"
      :duration="400"
      :interval="4000"
      circular
      indicator-dots
      indicator-color="#ABA8A8"
      indicator-active-color="#fff"
      @change="onChange"
    >
      <swiper-item
        v-for="(item, index) in bannerList"
        :key="index"
        skip-hidden-item-layout
      >
        <JImage
          :id="index"
          :src="item.pic"
          :lazy-load="currentIndex !== index"
          width="100%"
          height="100%"
          radius="14rpx"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import { getBanner } from '@/api/home'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'
import type { Banner } from '@/api/interface/Banner'

const autoplay = ref(false)
const bannerList = shallowRef<Banner[]>([])
const currentIndex = ref(0)

fetchBanner()

onShow(() => { autoplay.value = true })
onHide(() => { autoplay.value = false })

onMounted(() => {
  const observer = uni.createIntersectionObserver(getCurrentInstance()?.proxy)
  observer.relativeToViewport({ bottom: 100 }).observe(`.carousel`, (res) => {
    autoplay.value = false

    if (res.intersectionRatio === 0) return

    autoplay.value = true
  })
})

function onChange({ detail: { current }}: SwiperOnChangeEvent) {
  // console.log('🚀 ~ file: Carousel.vue:42 ~ onChange ~ e:', current)
  currentIndex.value = current
}

async function fetchBanner() {
  const { banners } = await getBanner(1)
  bannerList.value = banners

  console.log('🚀 ~ file: Carousel.vue:40 ~ fetchBanner ~ banners:', banners)
}
</script>
