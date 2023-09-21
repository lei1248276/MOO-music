<template>
  <Navbar
    :title="title"
    left-arrow
  />

  <template v-if="playlist">
    <!-- #ifdef H5 -->
    <H5BackTransition :ref="(el: any) => el?.open()">
      <!-- #endif -->
      <view class="min-h-full px-[28rpx] bg-black-2 after:block after:pb-[var(--save-bottom)]">
        <Cover
          :playlist="playlist"
          :image="playlist.coverImgUrl"
          :description="playlist.description"
        />

        <Creator :userinfo="playlist.creator" />

        <button
          v-for="tag in playlist.tags"
          :key="tag"
          size="mini"
          class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx]"
          @tap="useNavigateTo(`/sharedPages/searchSongs/searchSongs?keyword=${tag}`)"
        >
          #{{ tag }}
        </button>

        <Subtitle
          icon="icon-menu"
          icon-size="60rpx"
          class="z-50 sticky top-[44px] right-0 left-0 bg-black-2"
          :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
        >
          <template #title>
            <view class="flex items-center">
              <button
                class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
                size="mini"
                @tap="audioStore.onPlay(audioStore.mode === 'random' ? rangeRandom(0, songs.length) : 0, songs, playlist)"
              >
                <JIcon custom-class="icon-play text-[42rpx]" />
              </button>

              <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
                {{ playlist.trackCount }}
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
            :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
            :is-run="audioStore.currentSongInfo?.song.id === song.id"
            :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
            @click="audioStore.onPlay(index, songs, playlist)"
          />
        </view>
      </view>
      <!-- #ifdef H5 -->
    </H5BackTransition>
    <!-- #endif -->
  </template>

  <PlayController />
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { Playlist } from '@/api/interface/Playlist'
import { getPlaylist } from '@/api/playlist'
import { getSongs } from '@/api/playlist'
import Cover from './components/Cover/Cover.vue'
import Creator from './components/Creator/Creator.vue'
import { rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()

const title = ref('')
const playlist = shallowRef<Playlist>()
const songs = shallowReactive<Playlist['tracks']>([])

onLoad((options) => {
  fetchPlaylist(Number((options as { id: string }).id))
})

onReachBottom(() => {
  if (!playlist.value || songs.length >= playlist.value.trackCount) return

  fetchSongs()
})

async function fetchSongs() {
  if (!playlist.value) return

  const offset = songs.length
  const _trackIds = playlist.value.trackIds.slice(offset, offset + 20)
  const ids = _trackIds.reduce((acc, cur) => (acc += cur.id + ','), '')
  const { songs: newSongs = [] } = await getSongs(ids.slice(0, -1))
  console.log('🚀 ~ file: playlist.vue:129 ~ fetchSongs ~ newSongs:', newSongs)

  songs.push(...newSongs)
}

async function fetchPlaylist(id: number) {
  const { playlist: _playlist } = await getPlaylist(id)
  console.log('🚀 ~ file: playlist.vue:59 ~ fetchPlaylist ~ playlist:', _playlist)

  title.value = _playlist.name
  playlist.value = _playlist
  songs.push(..._playlist.tracks)
}
</script>
