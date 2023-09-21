<template>
  <Navbar
    title="🎵 歌单列表"
    left-arrow
  />

  <template v-if="songlist.length">
    <!-- #ifdef H5 -->
    <H5BackTransition :ref="(el: any) => el?.open()">
      <!-- #endif -->
      <Songlist
        :songlist="songlist"
        custom-class="min-h-full bg-black-2 px-[28rpx]"
        @click="(songlist) => { useNavigateTo(`/sharedPages/playlist/playlist?id=${songlist.id}`)}"
      />
    <!-- #ifdef H5 -->
    </H5BackTransition>
  <!-- #endif -->
  </template>

  <PlayController />
</template>

<script setup lang="ts">
import { getSonglist } from '@/api/songlist'
import type { Songlist } from '@/api/interface/Songlist'

const songlist = shallowReactive<Songlist[]>([])
const limit = 20
let total = 0

fetchSonglist()

onReachBottom(() => {
  songlist.length !== total && fetchSonglist()
})

async function fetchSonglist() {
  const { playlists, total: _total } = await getSonglist(songlist.length, limit)
  console.log('🚀 ~ file: songlist.vue:41 ~ fetchSonglist ~ playlists:', playlists, _total)

  total = _total
  songlist.push(...playlists)
}
</script>
