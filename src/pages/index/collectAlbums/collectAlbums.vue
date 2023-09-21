<template>
  <Navbar
    title="🎵 收藏专辑"
    left-arrow
  />

  <Subtitle
    icon="icon-more"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx]"
    custom-class="!my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="w-[120rpx] h-[60rpx] leading-[60rpx] rounded-full bg-yellow-1 text-black-1 text-[34rpx] text-center">
        {{ cacheStore.collectAlbums.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(album, index) in lazyList"
          :key="album.id"
          class="animate-content"
          :right-options="rightBtnStyle"
          :auto-close="false"
          @click="onClick(index)"
        >
          <Album
            :album="album"
            @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
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
import type { Album } from '@/components/Album/Album.vue'

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

const limit = 5
const lazyList = shallowReactive<Album[]>(cacheStore.collectAlbums.slice(0, limit))

onReachBottom(() => {
  const len = lazyList.length
  if (len >= cacheStore.collectAlbums.length) return

  lazyList.push(...cacheStore.collectAlbums.slice(len, len + limit))
})

function onClick(index: number) {
  cacheStore.collectAlbums.splice(index, 1)
  lazyList.splice(index, 1)
}
</script>
