<template>
  <Navbar
    :title="title"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <template v-if="playlist">
    <!-- #ifdef H5 -->
    <H5BackTransition :show="isShowPage">
      <!-- #endif -->
      <view class="min-h-full px-[28rpx] bg-black-2 after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
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
          @tap="toSearchSongs(tag)"
        >
          #{{ tag }}
        </button>

        <Subtitle
          icon="icon-menu"
          icon-size="60rpx"
        >
          <template #title>
            <view class="flex items-center">
              <button
                class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
                size="mini"
                @tap="onSong(0)"
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
import type { Songlist } from '@/api/interface/Songlist'
import type { Playlist } from '@/api/interface/Playlist'
import { getPlaylist } from '@/api/playlist'
import { getSongs } from '@/api/playlist'
import Cover from './components/Cover/Cover.vue'
import Creator from './components/Creator/Creator.vue'

const audioStore = useAudioStore()

const title = ref('')
const playlist = shallowRef<Playlist>()
const songs = shallowReactive<Playlist['tracks']>([])

// #ifdef H5
const isShowPage = ref(true)
// #endif

onLoad(async() => {
  // @ts-ignore
  const opener = getCurrentInstance().proxy.getOpenerEventChannel()

  // *（tracks === songs）歌单歌曲列表，每个歌单会额外携带前20首歌曲
  opener.on('acceptSonglist', async(songlist: Songlist) => {
    console.log('🚀 ~ file: playlist.vue:35 ~ opener.on ~ songlist:', songlist)
    const { id, name, tracks } = songlist
    // ! 歌单播放列表有可能为null，需要重新请求歌单
    if (!tracks) return fetchPlaylist(id)

    // ! songlist少了一些playlist属性，不过暂时用不到，所以断言逃逸掉（避免多发一次请求）
    title.value = name
    playlist.value = songlist as Playlist
    songs.push(...tracks)
  })

  // * 针对有缓存playlist的场景或提前获取的
  opener.on('acceptPlaylist', (_playlist: Playlist) => {
    console.log('🚀 ~ file: playlist.vue:25 ~ opener.on ~ _playlist:', _playlist)
    title.value = _playlist.name
    playlist.value = _playlist
    songs.push(..._playlist.tracks)
  })
})

onReachBottom(() => {
  if (!playlist.value || songs.length >= playlist.value.trackCount) return

  fetchSongs()
})

function toSearchSongs(tag: string) {
  uni.navigateTo({
    url: `/sharedPages/searchSongs/searchSongs?keyword=${tag}`,
    fail: (err) => { console.error(err) }
  })
}

function onSong(index: number) {
  console.log('🚀 ~ file: playlist.vue:121 ~ onSong ~ song:', songs[index])
  audioStore.$patch(state => {
    if (state.playlist !== playlist.value) state.playlist = playlist.value
    if (state.songs !== songs) state.songs = songs
    audioStore.setCurrentSong(songs[index], index)
  })
}

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
