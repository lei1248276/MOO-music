<template>
  <Navbar
    :title="album?.name || ''"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <template v-if="album">
    <!-- #ifdef H5 -->
    <H5BackTransition :show="isShowPage">
      <!-- #endif -->
      <view class="px-[28rpx] after:block after:pb-[var(--save-bottom)]">
        <AlbumInfo :album="album" />

        <Subtitle
          icon="icon-menu"
          icon-size="60rpx"
          class="z-50 sticky top-[44px] right-0 left-0 bg-black-2"
          :style="{ top: 44 + statusBarHeight + 'px' }"
        >
          <template #title>
            <view class="flex items-center">
              <button
                class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
                size="mini"
                @tap="onSong(0)"
              >
                <JIcon custom-class="icon-play text-[40rpx]" />
              </button>

              <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
                {{ songs.length }}
              </text>
            </view>
          </template>
        </Subtitle>

        <view class="animate-enter-content">
          <Song
            v-for="(song, index) in songs"
            :key="song.id"
            class="animate-content"
            :song="song"
            :is-play="audioStore.isPlay"
            :is-run="audioStore.currentSongInfo?.song.id === song.id"
            @click="onSong(index)"
          />
        </view>
      </view>
      <!-- #ifdef H5 -->
    </H5BackTransition>
    <!-- #endif -->
  </template>

  <PlayController />
</template>

<script setup lang="ts">
import type { Album, Song } from '@/api/interface/Album'
import { getAlbumDetail } from '@/api/album'
import AlbumInfo from './components/AlbumInfo/AlbumInfo.vue'

// #ifdef H5
const isShowPage = ref(true)
// #endif

const statusBarHeight = useStatusBarHeight()
const audioStore = useAudioStore()

const album = shallowRef<Album>()
const songs = shallowReactive<Song[]>([])

onLoad((options) => {
  fetchAlbumDetail((options as { id: number }).id)
})

function onSong(index: number) {
  audioStore.$patch(state => {
    if (state.songs !== songs) state.songs = songs

    if (audioStore.playlist) audioStore.playlist = undefined

    audioStore.setCurrentSong(songs[index], index)
  })
}

async function fetchAlbumDetail(id: number) {
  const { songs: _songs, album: _album } = await getAlbumDetail(id)
  console.log('🚀 ~ file: album.vue:17 ~ fetchAlbumDetail ~ album:', _songs, _album)
  album.value = _album
  songs.push(..._songs)
}
</script>
