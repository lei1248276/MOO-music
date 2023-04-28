<template>
  <swiper
    class="swiper"
    :autoplay="true"
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
      <Image
        :id="index"
        :src="item.pic"
        :passive="currentIndex === index"
        width="100%"
        height="100%"
        radius="14rpx"
      />
    </swiper-item>
  </swiper>
</template>

<script setup lang="ts">
import { getBanner } from '@/api/home'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'

const bannerList = ref<{ pic: string }[]>([])
const currentIndex = ref(0)

;(async function fetchBanner() {
  const { banners } = await getBanner(1)
  bannerList.value = banners
  console.log('🚀 ~ file: Carousel.vue:40 ~ fetchBanner ~ banners:', banners)
})()

function onChange({ detail: { current }}: SwiperOnChangeEvent) {
  // console.log('🚀 ~ file: Carousel.vue:42 ~ onChange ~ e:', current)
  currentIndex.value = current
}
</script>
