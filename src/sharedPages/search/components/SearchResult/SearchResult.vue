<template>
  <view
    class="bg-black-2 fixed bottom-0 right-0 left-0 px-[28rpx] overflow-y-auto after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]"
    :style="{ top: `calc(44px + 94rpx + ${statusBarHeight}px)`}"
  >
    <SearchHistory
      v-show="!suggests.length && !songs.length"
      @select="fetchSongs"
    />

    <template v-if="!songs.length">
      <view
        v-for="(item, index) in suggests"
        :key="index"
        hover-class="bg-grey-1/10"
        hover-stay-time="50"
        class="text-white-1 text-base mb-1"
        @tap="onSelect(item.keyword)"
      >
        {{ item.keyword }}
      </view>
    </template>

    <template v-else>
      <Subtitle
        title="歌曲"
        clickable
        custom-class="mt-0"
        :url="`/sharedPages/searchSongs/searchSongs?keyword=${keyword}`"
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
import SearchHistory from '../SearchHistory/SearchHistory.vue'

defineProps<{
  suggests: Suggests[]
}>()

const statusBarHeight = useStatusBarHeight()
const audioStore = useAudioStore()
const cacheStore = useCacheStore()

const keyword = ref('')
const songs = shallowRef<Song[]>([])

// #ifdef H5
onMounted(() => {
  // * 因为uni-popup禁止了页面滚动导致后续跳转页面滚动失效，所以将其还原
  document.getElementsByTagName('body')[0].style.overflow = 'visible'
})
// #endif

function onSelect(_keyword: string) {
  fetchSongs(_keyword)
  cacheStore.addHistorySearch(_keyword)
}

function onSong(index: number) {
  audioStore.$patch(state => {
    if (audioStore.playlist) audioStore.playlist = undefined

    if (state.songs !== songs.value) state.songs = songs.value

    audioStore.setCurrentSong(songs.value[index], index)
  })
}

async function fetchSongs(_keyword: string) {
  console.log('🚀 ~ file: SearchResult.vue:74 ~ fetchSongs ~ _keyword:', _keyword)
  keyword.value = _keyword
  const { result } = await getSearch(_keyword, 1, 0, 6)
  console.log('🚀 ~ file: Search.vue:93 ~ fetchSongs ~ songs:', result.songs)
  songs.value = result.songs as Song[]
}

async function fetchArtist(keyword: string) {
  const { result } = await getSearch(keyword, 100, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:68 ~ fetchArtist ~ result:', result)
}

function clear() {
  songs.value = []
}

defineExpose({
  clear,
  fetchSongs
})
</script>
