<template>
  <Navbar
    :title="title"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <template v-if="playlist">
    <!-- #ifdef H5 -->
    <uni-transition
      :mode-class="['slide-right']"
      :show="isShowPage"
      @change="onShowPage"
    >
      <!-- #endif -->
      <view class="min-h-screen px-[28rpx] bg-black-2 after:block after:content-[''] after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
        <Cover
          :id="playlist.id"
          :image="playlist.coverImgUrl"
          :description="playlist.description"
        />

        <Creator :userinfo="playlist.creator" />

        <button
          v-for="tag in playlist.tags"
          :key="tag"
          size="mini"
          class="rounded-full bg-yellow-1 text-black-1 mr-[20rpx] mb-[20rpx] font-bold"
        >
          {{ tag }}
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
              >
                <JIcon custom-class="icon-play text-[42rpx]" />
              </button>

              <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
                {{ playlist.trackCount }}
              </text>
            </view>
          </template>
        </Subtitle>

        <Song
          v-for="(song, index) in songs"
          :key="song.id"
          :song="song"
          :is-play="audioStore.isPlay"
          :is-run="audioStore.currentSongInfo?.song.id === song.id"
          @click="onSong(index)"
        />
      </view>
      <!-- #ifdef H5 -->
    </uni-transition>
    <!-- #endif -->
  </template>

  <PlayController />
</template>

<script setup lang="ts">
import type { UniTransitionOnChangeEvent } from '@uni-helper/uni-ui-types'
import type { Songlist } from '@/api/interface/Songlist'
import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'
import { getPlaylist } from '@/api/playlist'
import { getSongs } from '@/api/playlist'
import Cover from './components/Cover/Cover.vue'
import Creator from './components/Creator/Creator.vue'

const audioStore = useAudioStore()

const title = ref('')
const playlist = shallowRef<Playlist>()
const songs = shallowReactive<Song[]>([])

// #ifdef H5
const isShowPage = ref(true)
function onShowPage({ detail: isShow }: UniTransitionOnChangeEvent) {
  !isShow && uni.navigateBack()
}
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

function onSong(index: number) {
  console.log('🚀 ~ file: playlist.vue:121 ~ onSong ~ song:', songs[index])
  if (audioStore.playlist !== playlist.value) {
    audioStore.playlist = playlist.value
  }

  if (audioStore.songs !== songs || audioStore.songs.length !== songs.length) {
    audioStore.songs = songs
  }

  audioStore.setCurrentSong(songs[index], index)
}

async function fetchSongs() {
  if (!playlist.value) return

  const offset = songs.length
  const _trackIds = playlist.value.trackIds.slice(offset, offset + 20)
  const ids = _trackIds.reduce((acc, cur) => (acc += cur.id + ','), '')
  const { songs: newSongs = [] } = await getSongs(ids.slice(0, -1))
  console.log('🚀 ~ file: playlist.vue:129 ~ fetchSongs ~ newSongs:', newSongs)

  songs.push(...newSongs)
  // this.setData(spreadArray(newSongs, songs, 'songs'))
}

async function fetchPlaylist(id: number) {
  const { playlist: _playlist } = await getPlaylist(id)
  console.log('🚀 ~ file: playlist.vue:59 ~ fetchPlaylist ~ playlist:', _playlist)

  title.value = _playlist.name
  playlist.value = _playlist
  songs.push(..._playlist.tracks)
}
</script>
