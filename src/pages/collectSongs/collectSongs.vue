<template>
  <Navbar
    title="收藏音乐"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] after:block after:content-[''] after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
      <Subtitle
        icon="icon-menu"
        icon-size="60rpx"
        class="z-50 sticky top-[44px] left-0 right-0 bg-black-2"
        :style="{ top: 44 + statusBarHeight + 'px' }"
      >
        <template #title>
          <view class="flex items-center">
            <button
              class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
              size="mini"
              @tap="onSong(0)"
            >
              <JIcon custom-class="icon-play text-[42rpx]" />
            </button>

            <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
              {{ cacheStore.collectSongs.length }}
            </text>
          </view>
        </template>
      </Subtitle>

      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(song, index) in lazyList"
          :key="song.id"
          class="animate-content"
          :right-options="rightBtnStyle"
          :auto-close="false"
          @click="onClick(index)"
        >
          <Song
            :song="song"
            :is-play="audioStore.isPlay"
            :is-run="audioStore.currentSongInfo?.song.id === song.id"
            @click="onSong(index)"
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
import type { Song } from '@/api/interface/Song'

const audioStore = useAudioStore()
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

const limit = 10
const lazyList = shallowReactive<Song[]>(cacheStore.collectSongs.slice(0, limit))

onReachBottom(() => {
  const len = lazyList.length
  if (len >= cacheStore.collectSongs.length) return

  lazyList.push(...cacheStore.collectSongs.slice(len, len + limit))
})

function onClick(index: number) {
  cacheStore.collectSongs.splice(index, 1)
  lazyList.splice(index, 1)
}

function onSong(index: number) {
  audioStore.$patch(state => {
    if (state.songs !== cacheStore.collectSongs) state.songs = cacheStore.collectSongs

    audioStore.setCurrentSong(cacheStore.collectSongs[index], index)
  })
}
</script>
