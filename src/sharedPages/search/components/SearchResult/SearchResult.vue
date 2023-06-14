<template>
  <view
    class="bg-black-2 fixed bottom-0 right-0 left-0 px-[28rpx] overflow-y-auto after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]"
    :style="{ top: `calc(44px + 94rpx + ${statusBarHeight}px)`}"
  >
    <template v-if="!songs.length">
      <view
        v-for="({keyword}, index) in suggests"
        :key="index"
        hover-class="bg-grey-1/10"
        hover-stay-time="50"
        class="text-white-1 text-base mb-1"
        @tap="fetchSongs(keyword)"
      >
        {{ keyword }}
      </view>
    </template>

    <template v-else>
      <Subtitle
        title="歌曲"
        clickable
        custom-class="mt-0"
      />

      <Song
        v-for="(song, index) in songs"
        :key="song.id"
        :song="song"
        :is-play="audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === song.id"
        @click="onSong(index)"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import type { Suggests } from '@/api/interface/SearchSuggest'
import type { Song } from '@/api/interface/Song'
import { getSearch } from '@/api/search'

defineProps<{
  suggests: Suggests[]
}>()

const statusBarHeight = useStatusBarHeight()
const audioStore = useAudioStore()

const songs = shallowRef<Song[]>([])

function clear() {
  songs.value = []
}

function onSong(index: number) {
  audioStore.$patch(state => {
    if (audioStore.playlist) audioStore.playlist = undefined

    if (state.songs !== songs.value) state.songs = songs.value

    audioStore.setCurrentSong(songs.value[index], index)
  })
}

async function fetchSongs(keyword: string) {
  const { result } = await getSearch(keyword, 1, 0, 6)
  console.log('🚀 ~ file: Search.vue:93 ~ fetchSongs ~ songs:', result.songs)
  songs.value = result.songs as Song[]
}

async function fetchArtist(keyword: string) {
  const { result } = await getSearch(keyword, 100, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:68 ~ fetchArtist ~ result:', result)
}

defineExpose({ clear })
</script>
