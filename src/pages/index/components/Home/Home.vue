<template>
  <scroll-view
    class="box-border h-full overflow-hidden"
    scroll-y
    enable-passive
    scroll-anchoring
    enable-back-to-top
    refresher-enabled
    refresher-background="#1a191b"
    :refresher-triggered="refreshTrigger"
    @refresherrefresh="onRefresh"
  >
    <view class="px-[28rpx] pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
      <Carousel />

      <Recommend ref="recommend" />

      <NewSonglist ref="newSonglist" />

      <NewSong />

      <NewAlbum />

      <SearchTags />
    </view>
  </scroll-view>
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
const refreshTrigger = ref(false)

async function onRefresh() {
  refreshTrigger.value = true

  await recommend.value?.fetchRecommend()
  await newSonglist.value?.fetchNewSonglist()

  refreshTrigger.value = false
}
</script>
