<template>
  <view class="animate-enter-content mt-[40rpx] mx-[28rpx] after:block after:pb-[var(--save-bottom)]">
    <Subtitle
      clickable
      :url="`/sharedPages/searchSongs/searchSongs?keyword=${name}`"
    >
      <template #title>
        <view class="flex items-center">
          <button
            class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
            size="mini"
            @tap.stop="onSong(0)"
          >
            <JIcon custom-class="icon-play text-[42rpx]" />
          </button>

          <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
            {{ cacheList.length }}
          </text>
        </view>
      </template>
    </Subtitle>

    <template v-if="isLoaded">
      <Song
        v-for="(song, index) in songs"
        :key="song.id"
        class="animate-content"
        :song="song"
        :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === song.id"
        :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
        @click="onSong(index)"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import type { HotSong } from '@/api/interface/ArtistSongs'
import { getArtistSongs } from '@/api/artist'

const props = defineProps<{
  id: number
  name: string
  lazyLoad: boolean
}>()

const audioStore = useAudioStore()

const isLoaded = ref(false)
const songs = shallowReactive<HotSong[]>([])
const cacheList = shallowRef<HotSong[]>([])

// ! lazyLoad 和 isLoaded 都为 false 时才进行请求加载
const unwatch = watch(() => props.lazyLoad, async ok => {
  if (!ok && !isLoaded.value) {
    await fetchArtistSongs(props.id)
    isLoaded.value = true
    unwatch()
  }
}, { immediate: true })

function onSong(index: number) {
  console.log('🚀 ~ file: playlist.vue:121 ~ onSong ~ song:', songs[index])
  audioStore.$patch(state => {
    if (state.playlist) state.playlist = undefined
    if (state.songs !== songs) state.songs = songs
    audioStore.setCurrentSong(songs[index], index)
  })
}

function loadMore(limit = 10) {
  if (songs.length === cacheList.value.length) return

  songs.push(...cacheList.value.slice(songs.length, songs.length + limit))
}

async function fetchArtistSongs(id: number) {
  const { hotSongs } = await getArtistSongs(id)
  console.log('🚀 ~ file: artist.vue:117 ~ fetchArtistSongs ~ hotSongs:', hotSongs)
  cacheList.value = hotSongs
  loadMore()
}

defineExpose({
  loadMore
})
</script>
