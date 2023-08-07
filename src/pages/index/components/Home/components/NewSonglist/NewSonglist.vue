<template>
  <Subtitle
    title="MOO Songlist_歌单"
    clickable
    url="./songlist/songlist"
  />

  <Songlist
    :songlist="newSonglist"
    @click="(songlist) => {useNavigateTo(`/sharedPages/playlist/playlist?id=${songlist.id}`)}"
  />
</template>

<script setup lang="ts">
import { getNewSonglist } from '@/api/home'
import type { Songlist } from '@/api/interface/Songlist'
import { rangeRandom, shuffle } from '@/utils/util'

let cacheList: Songlist[] = []
const newSonglist = shallowRef<Songlist[]>(new Array(4).fill({}))

onShow(() => {
  if (!cacheList.length) return

  freshSonglist()
})

fetchNewSonglist()

function freshSonglist() {
  newSonglist.value = shuffle(cacheList).slice(0, 4)
}

async function fetchNewSonglist() {
  const { playlists } = await getNewSonglist(rangeRandom(0, 100), 20)
  console.log('🚀 ~ file: NewSonglist.vue:17 ~ fetchNewSonglist ~ playlists:', playlists)

  cacheList = playlists
  freshSonglist()
}

defineExpose({
  fetchNewSonglist
})
</script>
