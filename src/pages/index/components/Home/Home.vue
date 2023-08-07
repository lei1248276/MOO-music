<template>
  <view class="box-border overflow-y-scroll h-full px-[28rpx] pb-[var(--save-bottom)]">
    <Carousel />

    <Recommend />

    <NewSonglist />

    <NewSong />

    <NewAlbum />

    <SearchTags />
  </view>
</template>

<script setup lang="ts">
import Carousel from './components/Carousel/Carousel.vue'
import Recommend from './components/Recommend/Recommend.vue'
import NewSonglist from './components/NewSonglist/NewSonglist.vue'
import NewSong from './components/NewSong/NewSong.vue'
import NewAlbum from './components/NewAlbum/NewAlbum.vue'
import SearchTags from './components/SearchTags/SearchTags.vue'
</script>
