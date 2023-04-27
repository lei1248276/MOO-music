<template>
  <view class="min-h-screen bg-black-2">
    <Navbar />

    <NavTitle
      :pages="pages"
      :current-page="currentPage"
    />

    <swiper
      class="bg-black-2 min-h-screen"
      :duration="300"
      @change="onSwiper"
    >
      <swiper-item skip-hidden-item-layout>
        <Home />
      </swiper-item>

      <swiper-item skip-hidden-item-layout>
        <Profile />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import NavTitle from './components/NavTitle.vue'
import Home from './components/Home.vue'
import Profile from './components/Profile.vue'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'

const pages = ['home', 'profile']
const currentPage = ref<typeof pages[number]>('home')

function onSwiper({ detail: { current }}: SwiperOnChangeEvent) {
  currentPage.value = pages[current] as typeof pages[number]
}
</script>
