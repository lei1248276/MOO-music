<template>
  <Navbar
    title="最近播放"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="animate-enter-content bg-black-2 px-[28rpx] after:block after:content-[''] after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
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
              {{ cacheStore.historyPlays.length }}
            </text>
          </view>
        </template>
      </Subtitle>

      <Song
        v-for="(song, index) in cacheStore.historyPlays"
        :key="song.id"
        class="animate-content"
        :song="song"
        :is-play="audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === song.id"
        @click="onSong(index)"
      />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
const audioStore = useAudioStore()
const cacheStore = useCacheStore()
const statusBarHeight = useStatusBarHeight()

// #ifdef H5
const isShowPage = ref(true)
// #endif

function onSong(index: number) {
  audioStore.$patch(state => {
    if (state.songs !== cacheStore.historyPlays) state.songs = cacheStore.historyPlays

    audioStore.setCurrentSong(cacheStore.historyPlays[index], index)
  })
}
</script>
