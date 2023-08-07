<template>
  <Subtitle
    title="MOO Track_新歌"
    clickable
    @title="playlist?.id && useNavigateTo(`/sharedPages/playlist/playlist?id=${playlist.id}`)"
  />

  <Song
    v-for="(song, index) in songs.slice(0, 4)"
    :key="song.id"
    :song="song"
    :is-play="audioStore.currentSongInfo?.song.id === song.id && audioStore.isPlay"
    :is-run="audioStore.currentSongInfo?.song.id === song.id"
    :cannot-play="audioStore.currentSongInfo?.song.id === song.id && !audioStore.currentSongInfo?.urlInfo.url"
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
