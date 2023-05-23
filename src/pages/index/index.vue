<template>
  <view class="h-full bg-black-2 flex flex-col justify-stretch overflow-hidden">
    <Navbar />

    <NavTitle
      :pages="pages"
      :current-page="currentPage"
    />

    <Search />

    <!-- * 解决小程序真机上swiper使用flex-grow无效的问题 -->
    <view class="bg-black-2 grow relative">
      <swiper
        class="!h-full absolute top-0 left-0 right-0 bottom-0"
        :duration="200"
        @change="onChangePage"
      >
        <swiper-item skip-hidden-item-layout>
          <Home ref="home" />
        </swiper-item>

        <swiper-item skip-hidden-item-layout>
          <Profile />
        </swiper-item>
      </swiper>
    </view>
  </view>

  <PlayController />
</template>

<script setup lang="ts">
import NavTitle from './components/NavTitle/NavTitle.vue'
import Search from './components/Search/Search.vue'
import Home from './components/Home/Home.vue'
import Profile from './components/Profile/Profile.vue'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'

const pages = ['home', 'profile']
const currentPage = ref<typeof pages[number]>('home')

onPullDownRefresh(async() => {
  const { home } = getCurrentInstance()?.refs as { home: InstanceType<typeof Home> }
  console.log('onPullDownRefresh', home.recommend, home.newSonglist)

  await home.recommend?.fetchRecommend()
  await home.newSonglist?.fetchNewSonglist()
  uni.stopPullDownRefresh()
})

function onChangePage({ detail: { current }}: SwiperOnChangeEvent) {
  currentPage.value = pages[current] as typeof pages[number]
}
</script>
