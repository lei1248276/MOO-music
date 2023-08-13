<template>
  <view class="bg-black-2 rounded-tl-lg rounded-tr-lg overflow-hidden">
    <Subtitle
      icon="icon-more"
      icon-size="50rpx"
      custom-class="px-[28rpx] bg-black-2"
    >
      <template #title>
        <view class="flex items-center">
          <button
            class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
            size="mini"
            @tap="onSong(lazyList[audioStore.mode === 'random' ? rangeRandom(0, lazyList.length) : 0].id)"
          >
            <JIcon custom-class="icon-play text-[42rpx]" />
          </button>

          <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
            {{ audioStore.songs.length }}
          </text>
        </view>
      </template>
    </Subtitle>

    <scroll-view
      class="h-[50vh]"
      scroll-y
      enable-passive
      scroll-anchoring
      scroll-with-animation
      :scroll-into-view="scrollIntoView"
      :lower-threshold="500"
      @scrolltolower="onScrollToLower"
    >
      <view class="box-border px-[28rpx] pb-[var(--save-bottom)]">
        <Song
          v-for="item in lazyList"
          :id="'_' + item.id"
          :key="item.id"
          :song="item"
          :is-play="audioStore.currentSongInfo?.song.id === item.id && audioStore.isPlay"
          :is-run="audioStore.currentSongInfo?.song.id === item.id"
          :cannot-play="audioStore.currentSongInfo?.song.id === item.id && !audioStore.currentSongInfo?.urlInfo.url"
          @click="onSong(item.id)"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import { rangeRandom, sleep } from '@/utils/util'

const audioStore = useAudioStore()

const scrollIntoView = ref('')

onMounted(async() => {
  await sleep(333)

  watch(() => audioStore.currentSongIndex, (index) => {
    if (!audioStore.currentSongInfo?.song) return

    scrollIntoView.value = '_' + audioStore.songs[index].id
  }, { immediate: true })
})

// * 根据滚动方向来动态改变对应的指针‘offset’
const limit = 5
// ! ios全端向上滚加载更多都会发生偏移，暂时禁用向上滚动加载
const topOffset = audioStore.currentSongIndex < limit * 2 ? 0 : audioStore.currentSongIndex - limit * 2
let bottomOffset = audioStore.currentSongIndex + limit
const lazyList = shallowReactive<Song[]>(audioStore.songs.slice(topOffset, bottomOffset))

// * 向下滚加载更多
function onScrollToLower() {
  const end = bottomOffset + limit
  if (bottomOffset === end || bottomOffset >= audioStore.songs.length - 1) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToLower', { bottomOffset, end })

  lazyList.push(...audioStore.songs.slice(bottomOffset, end))
  bottomOffset = end
}

function onSong(id: number) {
  const index = audioStore.songs.findIndex(v => v.id === id)
  audioStore.setCurrentSong(audioStore.songs[index], index)
}
</script>
