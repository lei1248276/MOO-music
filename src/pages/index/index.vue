<template>
  <view class="h-full bg-black-2 flex flex-col justify-stretch overflow-hidden">
    <Navbar :class="{'invisible': isMV}" />

    <NavTitle
      :class="{'invisible': isMV}"
      :pages="pages"
      :current-page="currentPage"
    />

    <Search :class="{'invisible': isMV}" />

    <!-- * 解决小程序真机上swiper使用flex-grow无效的问题 -->
    <view class="bg-black-2 grow relative">
      <swiper
        class="!h-full absolute top-0 left-0 right-0 bottom-0"
        skip-hidden-item-layout
        :current="currentView"
        :duration="200"
        @change="({detail: {current}}: SwiperOnChangeEvent) => currentPage = pages[current]"
      >
        <!-- #ifndef APP-PLUS -->
        <swiper-item>
          <NewMV :is-show="isMV" />
        </swiper-item>
        <!-- #endif -->

        <swiper-item>
          <Home />
        </swiper-item>

        <swiper-item>
          <Profile />
        </swiper-item>
      </swiper>
    </view>
  </view>

  <PlayController :class="{'invisible': isMV}" />
</template>

<script setup lang="ts">
import NavTitle from './components/NavTitle/NavTitle.vue'
import Search from './components/Search/Search.vue'
import Home from './components/Home/Home.vue'
import Profile from './components/Profile/Profile.vue'
import NewMV from './components/NewMV/NewMV.vue'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'

let currentView = 0
const pages = ['home', 'profile']
const currentPage = ref<typeof pages[number]>('home')

// #ifndef APP-PLUS
currentView = 1
pages.unshift('mv')

const isMV = computed(() => currentPage.value === 'mv')
// #endif

</script>
