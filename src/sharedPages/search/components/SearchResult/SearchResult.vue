<template>
  <view
    class="bg-black-2 fixed bottom-0 right-0 left-0 px-[28rpx] overflow-y-auto after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]"
    :style="{ top: `calc(44px + 94rpx + ${statusBarHeight}px)`}"
  >
    <SearchHistory
      v-show="!suggests.length && !songs.length"
      @select="onSelect"
    />

    <template v-if="suggests.length">
      <view
        v-for="(item, index) in suggests"
        :key="index"
        hover-class="bg-grey-1/10"
        hover-stay-time="50"
        class="text-white-1 text-lg truncate py-1"
        @tap="onSelect(item.keyword)"
      >
        {{ item.keyword }}
      </view>
    </template>

    <template v-else>
      <template v-if="songs.length">
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

      <Subtitle
        title="专辑"
        clickable
        custom-class="mt-0"
        :url="`/sharedPages/searchAlbums/searchAlbums?keyword=${keyword}`"
      />
      <Album
        v-for="album in albums"
        :key="album.id"
        :album="album"
        @click="toAlbum(album.id)"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import type { Suggests } from '@/api/interface/SearchSuggest'
import type { SearchSongResponse, Song } from '@/api/interface/SearchSong'
import type { SearchAlbumResponse, Album } from '@/api/interface/SearchAlbum'
import { getSearch } from '@/api/search'
import SearchHistory from '../SearchHistory/SearchHistory.vue'

defineProps<{
  suggests: Suggests[]
}>()
const emit = defineEmits<{
  (e: 'update:suggests', value: Suggests[]): void
}>()

const statusBarHeight = useStatusBarHeight()
const audioStore = useAudioStore()
const cacheStore = useCacheStore()

const keyword = ref('')
const songs = shallowRef<Song[]>([])
const albums = shallowRef<Album[]>([])

// #ifdef H5
onShow(() => {
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
})
onHide(() => {
  // * 因为uni-popup禁止了页面滚动导致后续跳转页面滚动失效，所以将其还原
  document.getElementsByTagName('body')[0].style.overflow = 'visible'
})
// #endif

onUnmounted(() => { emit('update:suggests', []) })

function onSelect(_keyword: string) {
  fetchSongs(_keyword)
  fetchAlbum(_keyword)
  cacheStore.addHistorySearch(_keyword)
  emit('update:suggests', [])
  keyword.value = _keyword
}

function onSong(index: number) {
  audioStore.$patch(state => {
    if (audioStore.playlist) audioStore.playlist = undefined

    if (state.songs !== songs.value) state.songs = songs.value

    audioStore.setCurrentSong(songs.value[index], index)
  })
}

function toAlbum(id: number) {
  uni.navigateTo({
    url: `/sharedPages/album/album?id=${id}`,
    fail(err) { console.error(err) }
  })
}

async function fetchSongs(_keyword: string) {
  console.log('🚀 ~ file: SearchResult.vue:74 ~ fetchSongs ~ _keyword:', _keyword)
  const { result } = await getSearch<SearchSongResponse>(_keyword, 1, 0, 6)
  console.log('🚀 ~ file: Search.vue:93 ~ fetchSongs ~ songs:', result.songs)
  songs.value = result.songs
}

async function fetchAlbum(_keyword: string) {
  const { result } = await getSearch<SearchAlbumResponse>(_keyword, 10, 0, 2)
  console.log('🚀 ~ file: SearchResult.vue:109 ~ fetchAlbum ~ albums:', result.albums)
  albums.value = result.albums
}

/* async function fetchArtist(keyword: string) {
  const { result } = await getSearch(keyword, 100, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:68 ~ fetchArtist ~ result:', result)
} */

defineExpose({
  clear() {
    songs.value = []
    emit('update:suggests', [])
  },
  onSelect
})
</script>
