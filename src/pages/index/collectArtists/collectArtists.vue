<template>
  <Navbar
    title="🎵 收藏歌手"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <Subtitle
    icon="icon-more"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx]"
    custom-class="!my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="w-[120rpx] h-[60rpx] leading-[60rpx] rounded-full bg-yellow-1 text-black-1 text-[34rpx] text-center">
        {{ cacheStore.collectArtists.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(artist, index) in lazyList"
          :key="artist.id"
          class="animate-content"
          :right-options="rightBtnStyle"
          :auto-close="false"
          @click="onClick(index)"
        >
          <Artist
            :artist="artist"
            @click="toArtist(artist.id)"
          />
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import type { Artist } from '@/components/Artist/Artist.vue'

const cacheStore = useCacheStore()

// #ifdef H5
const isShowPage = ref(true)
// #endif

const rightBtnStyle = [{
  text: '删除',
  style: {
    backgroundColor: '#fd3148',
    fontSize: '32rpx',
    color: '#fffeff'
  }
}]

const limit = 10
const lazyList = shallowReactive<Artist[]>(cacheStore.collectArtists.slice(0, limit))

onReachBottom(() => {
  const len = lazyList.length
  if (len >= cacheStore.collectArtists.length) return

  lazyList.push(...cacheStore.collectArtists.slice(len, len + limit))
})

function toArtist(id: number) {
  uni.navigateTo({
    url: `/sharedPages/artist/artist?id=${id}`,
    fail: (err) => { console.error(err) }
  })
}

function onClick(index: number) {
  cacheStore.collectArtists.splice(index, 1)
  lazyList.splice(index, 1)
}
</script>
