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
      <view class="px-[28rpx] after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
        <JImage
          :src="album.picUrl + '?param=300y300'"
          width="500rpx"
          height="450rpx"
          radius="20rpx"
          custom-class="m-auto mt-5"
        />

        <view class="pt-[40rpx]">
          <text class="inline-block text-grey-1 text-[28rpx]">
            更新于  {{ parseTime(album.publishTime, '{y}-{m}-{d}') }}
          </text>

          <view class="text-white-1 mb-[20rpx]">
            <view class="flex justify-between items-center">
              <text class="inline-block w-4/5 truncate text-[40rpx]">{{ album.name }}</text>

              <JIcon
                type="icon-heart"
                size="60rpx"
                custom-class="text-grey-1"
              />
            </view>

            <view class="flex items-center my-[20rpx]">
              <JImage
                :src="album.artist.picUrl + '?param=70y70'"
                width="80rpx"
                height="80rpx"
                radius="50%"
              />
              <text class="ml-2">{{ album.artist.name }}</text>
            </view>

            <text class="line-clamp-6 text-[42rpx]">{{ album.description }}</text>

            <view class="mt-[20rpx] text-grey-2 text-[28rpx]">
              <text class="mr-3">分享 {{ album.info.shareCount }}</text>
              <text>喜欢 {{ album.info.likedCount }}</text>
            </view>
          </view>
        </view>

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
import { parseTime } from '@/utils/util'

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
