<template>
  <Subtitle
    title="MOO Track_新歌"
    clickable
    @title="toPlaylist"
  />

  <Song
    v-for="song in songs"
    :key="song.id"
    :song="song"
    :is-play="false"
    :is-run="false"
    @click="onSong(song)"
  />
</template>

<script setup lang="ts">
import { getRecommend, getPlaylist, getNewSong } from '@/api/home'
import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'

const playlist = shallowRef<Playlist>()
const songs = shallowRef<Song[]>([])

;(async function fetchNewSong() {
  // const data = await getNewSong()
  // console.log('%c🚀 ~ method: fetchNewSong ~', 'color: #F25F5C;font-weight: bold;', data)
  const { result: [{ id }] } = await getRecommend(1)
  const { playlist: _playlist } = await getPlaylist(id)
  const tracks = _playlist.tracks ? _playlist.tracks.slice(0, 4) : []
  console.log('🚀 ~ file: NewSong.vue:31 ~ fetchNewSong ~ tracks:', tracks)

  playlist.value = _playlist
  songs.value = tracks
})()

function toPlaylist() {

}

function onSong(song: Song) {
  console.log('🚀 ~ file: NewSong.vue:43 ~ onSong ~ song:', song)
}
</script>
