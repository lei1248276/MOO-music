<template>
  <Navbar
    title="🎵 歌单列表"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <template v-if="songlist.length">
    <!-- #ifdef H5 -->
    <H5BackTransition
      :show="isShowPage"
      class="w-full h-full"
    >
      <!-- #endif -->
      <Songlist
        :songlist="songlist"
        custom-class="min-h-full bg-black-2 px-[28rpx] after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]"
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

// #ifdef H5
const isShowPage = ref(true)
// #endif

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
