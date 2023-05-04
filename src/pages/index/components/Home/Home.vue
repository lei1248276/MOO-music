<template>
  <view class="h-full px-[28rpx] overflow-y-auto after:block after:content-[''] after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
    <Carousel />

    <Recommend ref="recommend" />

    <NewSonglist ref="newSonglist" />

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

const recommend = shallowRef<InstanceType<typeof Recommend>>()
const newSonglist = shallowRef<InstanceType<typeof NewSonglist>>()

defineExpose({
  recommend,
  newSonglist
})
</script>
