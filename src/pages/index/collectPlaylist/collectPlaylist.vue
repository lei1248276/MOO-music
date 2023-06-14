<template>
  <Navbar
    title="收藏歌单"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition
    :show="isShowPage"
    class="w-full h-full"
  >
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
      <Subtitle
        icon="icon-more"
        class="z-50 sticky top-[44px] left-0 right-0 bg-black-2"
        :style="{ top: 44 + statusBarHeight + 'px' }"
      >
        <template #title>
          <view class="flex items-center">
            <button
              class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
              size="mini"
            >
              <JIcon custom-class="icon-play text-[42rpx]" />
            </button>

            <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
              {{ cacheStore.collectPlaylist.length }}
            </text>
          </view>
        </template>
      </Subtitle>

      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(playlist, index) in lazyList"
          :key="playlist.id"
          class="animate-content"
          :right-options="rightBtnStyle"
          :auto-close="false"
          @click="onClick(index)"
        >
          <view
            class="flex items-center h-[200rpx] mb-5"
            @click="toPlaylist(index)"
          >
            <JImage
              :src="playlist.coverImgUrl + '?param=200y200'"
              width="200rpx"
              height="200rpx"
              radius="16rpx"
              lazy-load
            />

            <view class="ml-5 h-full flex flex-col justify-evenly text-bold">
              <view class="w-[450rpx] line-clamp-2 text-[36rpx] text-white-1">
                {{ playlist.name }}
              </view>

              <view class="w-[450rpx] text-[34rpx] text-grey-1">
                {{ playlist.creator.nickname }}
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import type { Playlist } from '@/api/interface/Playlist'

const cacheStore = useCacheStore()
const statusBarHeight = useStatusBarHeight()

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

const limit = 8
const lazyList = shallowReactive<Playlist[]>(cacheStore.collectPlaylist.slice(0, limit))

onReachBottom(() => {
  const len = lazyList.length
  if (len >= cacheStore.collectPlaylist.length) return

  lazyList.push(...cacheStore.collectPlaylist.slice(len, len + limit))
})

function toPlaylist(index: number) {
  uni.navigateTo({
    url: `/sharedPages/playlist/playlist`,
    success: (res) => { res.eventChannel.emit('acceptPlaylist', lazyList[index]) },
    fail: (err) => { console.error(err) }
  })
}

function onClick(index: number) {
  cacheStore.collectPlaylist.splice(index, 1)
  lazyList.splice(index, 1)
}
</script>
