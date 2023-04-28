<template>
  <view class="h-full px-[28rpx] overflow-y-auto">
    <Carousel />

    <Recommend />

    <NewSonglist />

    <NewSong />

    <view
      v-for="item in 100"
      :key="item"
    >
      {{ item }}
    </view>
  </view>
</template>

<script setup lang="ts">
import Carousel from './components/Carousel/Carousel.vue'
import Recommend from './components/Recommend/Recommend.vue'
import NewSonglist from './components/NewSonglist/NewSonglist.vue'
import NewSong from './components/NewSong/NewSong.vue'
</script>
