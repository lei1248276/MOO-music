<template>
  <Navbar
    title="🎵 最近播放"
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
          @tap="audioStore.onPlay(audioStore.mode === 'random' ? rangeRandom(0, cacheStore.historyPlays.length) : 0, cacheStore.historyPlays)"
        >
          <JIcon class="icon-play text-[42rpx]" />
        </button>

        <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
          {{ cacheStore.historyPlays.length }}
        </text>
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="animate-enter-content bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <Song
        v-for="(song, index) in cacheStore.historyPlays"
        :key="song.id"
        class="animate-content"
        :song="song"
        :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === song.id"
        :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
        @click="audioStore.onPlay(index, cacheStore.historyPlays.slice())"
      />
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

</script>
