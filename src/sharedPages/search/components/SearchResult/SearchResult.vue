<template>
  <view
    class="bg-black-2 fixed bottom-0 right-0 left-0 px-[28rpx] overflow-y-auto after:block after:pb-[var(--save-bottom)]"
    :style="{ top: `calc(44px + 94rpx + ${useStatusBarHeight().value}px)`}"
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
        :hover-stay-time="50"
        class="text-white-1 text-lg truncate py-1"
        @tap="onSelect(item.keyword)"
      >
        {{ item.keyword }}
      </view>
    </template>

    <template v-else>
      <template v-if="artist">
        <view class="mb-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1">歌手</view>
        <Artist
          :artist="artist"
          @click="useNavigateTo(`/sharedPages/artist/artist?id=${artist.id}`)"
        />
      </template>

      <template v-if="songs.length">
        <Subtitle
          title="歌曲"
          clickable
          class="mt-0"
          :url="`/sharedPages/searchSongs/searchSongs?keyword=${keyword}`"
        />
        <Song
          v-for="(song, index) in songs"
          :key="song.id"
          :song="song"
          :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
          :is-run="audioStore.currentSongInfo?.song.id === song.id"
          :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
          @click="audioStore.onPlay(0, [songs[index]])"
        />
      </template>

      <template v-if="albums.length">
        <Subtitle
          title="专辑"
          clickable
          class="mt-0"
          :url="`/sharedPages/searchAlbums/searchAlbums?keyword=${keyword}`"
        />
        <Album
          v-for="album in albums"
          :key="album.id"
          :album="album"
          @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
        />
      </template>
    </template>
  </view>
</template>

<script setup lang="ts">
import type { Suggests } from '@/api/interface/SearchSuggest'
import type { SearchSongResponse, Song } from '@/api/interface/SearchSong'
import type { SearchAlbumResponse, Album } from '@/api/interface/SearchAlbum'
import type { SearchArtistResponse, Artist } from '@/api/interface/SearchArtist'
import { getSearch } from '@/api/search'
import SearchHistory from '../SearchHistory/SearchHistory.vue'

defineProps<{
  suggests: Suggests[]
}>()
const emit = defineEmits<{
  (e: 'update:suggests', value: Suggests[]): void
}>()

const audioStore = useAudioStore()
const cacheStore = useCacheStore()

const keyword = ref('')
const songs = shallowRef<Song[]>([])
const albums = shallowRef<Album[]>([])
const artist = shallowRef<Artist>()

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
  fetchArtist(_keyword)
  fetchAlbum(_keyword)
  cacheStore.addHistorySearch(_keyword)
  emit('update:suggests', [])
  keyword.value = _keyword
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

async function fetchArtist(keyword: string) {
  const { result } = await getSearch<SearchArtistResponse>(keyword, 100, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:68 ~ fetchArtist ~ artists:', result.artists)
  artist.value = result.artists.shift()
}

defineExpose({
  clear() {
    songs.value = []
    albums.value = []
    artist.value = undefined
    emit('update:suggests', [])
  },
  onSelect
})
</script>
