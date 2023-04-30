<template>
  <Subtitle
    title="MOO Songlist_歌单"
    clickable
  />

  <Songlist :songlist="newSonglist" />
</template>

<script setup lang="ts">
import { getNewSonglist } from '@/api/home'
import type { Songlist } from '@/api/interface/Songlist'
import { rangeRandom } from '@/utils/util'

const newSonglist = shallowRef<Songlist[]>([])

fetchNewSonglist()

async function fetchNewSonglist() {
  const { playlists } = await getNewSonglist(rangeRandom(0, 100), 4)
  console.log('🚀 ~ file: NewSonglist.vue:17 ~ fetchNewSonglist ~ playlists:', playlists)

  newSonglist.value = playlists
}
</script>
