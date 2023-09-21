<template>
  <Navbar
    title="🎵 收藏音乐"
    left-arrow
  />

  <Subtitle
    icon="icon-menu"
    icon-size="60rpx"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx]"
    custom-class="!my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="flex items-center">
        <button
          class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
          size="mini"
          @tap="audioStore.onPlay(audioStore.mode === 'random' ? rangeRandom(0, cacheStore.collectSongs.length) : 0, cacheStore.collectSongs)"
        >
          <JIcon custom-class="icon-play text-[42rpx]" />
        </button>

        <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
          {{ cacheStore.collectSongs.length }}
        </text>
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
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
            :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
            :is-run="audioStore.currentSongInfo?.song.id === song.id"
            :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
            @click="audioStore.onPlay(index, cacheStore.collectSongs)"
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
import type { Song } from '@/components/Song/Song.vue'
import { rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()
const cacheStore = useCacheStore()

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
</script>
