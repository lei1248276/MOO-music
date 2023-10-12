<template>
  <Navbar
    title="🎵 收藏音乐"
    left-arrow
  />

  <Subtitle
    icon="icon-menu"
    icon-size="60rpx"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx] !my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="flex items-center">
        <button
          class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
          size="mini"
          @tap="audioStore.onPlay(audioStore.mode === 'random' ? rangeRandom(0, cacheStore.collectSongs.length) : 0, cacheStore.collectSongs)"
        >
          <JIcon class="icon-play text-[42rpx]" />
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
          :auto-close="false"
        >
          <Song
            :song="song"
            :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
            :is-run="audioStore.currentSongInfo?.song.id === song.id"
            :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
            @click="audioStore.onPlay(index, cacheStore.collectSongs)"
          />

          <template #right>
            <view
              class="bg-red-1 ml-1 w-[120rpx] h-[140rpx] leading-[140rpx] text-white-1 text-[30rpx] text-center"
              @tap="cacheStore.collectSongs.splice(index, 1)"
            >
              删除
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import { rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()
const cacheStore = useCacheStore()

const limit = 10
const offset = ref(10)
const lazyList = computed(() => cacheStore.collectSongs.slice(0, offset.value))

onReachBottom(() => {
  if (lazyList.value.length < cacheStore.collectSongs.length) offset.value += limit
})
</script>
