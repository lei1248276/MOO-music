<template>
  <Navbar
    title="🎵 收藏歌单"
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
        {{ cacheStore.collectPlaylist.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
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
            @click="toPlaylist(playlist)"
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

function toPlaylist(playlist: Playlist) {
  useNavigateTo({
    url: `/sharedPages/playlist/playlist?id=${playlist.id}`,
    success: (res) => { res.eventChannel.emit('acceptPlaylist', playlist) },
    fail: (err) => { console.error(err) }
  })
}

function onClick(index: number) {
  cacheStore.collectPlaylist.splice(index, 1)
  lazyList.splice(index, 1)
}
</script>
