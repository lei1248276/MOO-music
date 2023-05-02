<template>
  <Subtitle
    title="MOO Track_新歌"
    clickable
    @title="toPlaylist"
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

<script setup lang="ts">
import { getRecommend, getPlaylist, getNewSong } from '@/api/home'
import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'

const audioStore = useAudioStore()

const playlist = shallowRef<Playlist>()
const songs = shallowReactive<Song[]>([])

fetchNewSong()

function toPlaylist() {
  uni.navigateTo({
    url: `/sharedPages/playlist`,
    success: (res) => { res.eventChannel.emit('acceptPlaylist', playlist.value) },
    fail: (err) => { console.error(err) }
  })
}

function onSong(index: number) {
  console.log('🚀 ~ file: NewSong.vue:43 ~ onSong ~ song:', songs[index])
  if (audioStore.playlist !== playlist.value) {
    audioStore.playlist = playlist.value
  }

  if (audioStore.songs !== songs || audioStore.songs.length !== songs.length) {
    audioStore.songs = songs
  }

  audioStore.setCurrentSong(songs[index], index)
}

async function fetchNewSong() {
  // const data = await getNewSong()
  // console.log('🚀 ~ file: NewSong.vue:53 ~ fetchNewSong ~ data:', data)
  const { result: [{ id }] } = await getRecommend(1)
  const { playlist: _playlist } = await getPlaylist(id)
  const tracks = _playlist.tracks ? _playlist.tracks.slice(0, 4) : []
  console.log('🚀 ~ file: NewSong.vue:31 ~ fetchNewSong ~ tracks:', tracks)

  playlist.value = _playlist
  songs.push(...tracks)
}
</script>
