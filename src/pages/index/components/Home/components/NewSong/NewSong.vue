<template>
  <Subtitle
    title="MOO Track_新歌"
    clickable
    @title="toPlaylist"
  />

  <Song
    v-for="(song, index) in songs.slice(0, 4)"
    :key="song.id"
    :song="song"
    :is-play="audioStore.isPlay"
    :is-run="audioStore.currentSongInfo?.song.id === song.id"
    @click="onSong(index)"
  />
</template>

<script setup lang="ts">
import { getRecommend, getPlaylist, getNewSong } from '@/api/home'
import type { Playlist } from '@/api/interface/Playlist'

const audioStore = useAudioStore()

const playlist = shallowRef<Playlist>()
const songs = shallowReactive<Playlist['tracks']>([])

fetchNewSong()

function toPlaylist() {
  uni.navigateTo({
    url: `/sharedPages/playlist/playlist?id=${playlist.value?.id}`,
    success: (res) => { res.eventChannel.emit('acceptPlaylist', playlist.value) },
    fail: (err) => { console.error(err) }
  })
}

function onSong(index: number) {
  console.log('🚀 ~ file: NewSong.vue:43 ~ onSong ~ song:', songs[index])
  audioStore.$patch(state => {
    if (state.playlist !== playlist.value) state.playlist = playlist.value
    if (state.songs !== songs) state.songs = songs
    audioStore.setCurrentSong(songs[index], index)
  })
}

async function fetchNewSong() {
  const { result } = await getNewSong()
  console.log('🚀 ~ file: NewSong.vue:48 ~ fetchNewSong ~ result:', result)
  songs.push(...result.map(({ song }) => ({
    id: song.id,
    name: song.name,
    ar: song.artists,
    al: song.album
  })))

  // * 后续重写新歌页面
  const { result: [{ id }] } = await getRecommend(1)
  const { playlist: _playlist } = await getPlaylist(id)
  playlist.value = _playlist
}
</script>
