<template>
  <Navbar
    :title="'🎵 ' + title"
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
          @tap="audioStore.onPlay(audioStore.mode === 'random' ? rangeRandom(0, songs.length) : 0, songs)"
        >
          <JIcon class="icon-play text-[42rpx]" />
        </button>

        <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
          {{ songCount }}
        </text>
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="animate-enter-content bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <Song
        v-for="(song, index) in songs"
        :key="song.id"
        class="animate-content"
        :song="song"
        :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === song.id"
        :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
        @click="audioStore.onPlay(index, songs)"
      />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { SearchSongResponse, Song } from '@/api/interface/SearchSong'
import { getSearch } from '@/api/search'
import { rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()

const title = ref('搜索歌曲列表')
const keyword = ref('')
const songs = shallowReactive<Song[]>([])
const songCount = ref(0)

onLoad((query) => {
  title.value = keyword.value = (query as { keyword: string }).keyword
  console.log('🚀 ~ file: searchSongs.vue:9 ~ onLoad ~ keyword:', keyword.value)
  fetchSongs(keyword.value)
})

onReachBottom(() => {
  if (songs.length >= songCount.value) return

  fetchSongs(keyword.value)
})

async function fetchSongs(keyword: string) {
  const { result } = await getSearch<SearchSongResponse>(keyword, 1, songs.length, 20)
  console.log('🚀 ~ file: Search.vue:93 ~ fetchSongs ~ songs:', result.songs, result.songCount)
  songs.push(...result.songs as Song[])
  songCount.value = result.songCount
}
</script>
