<template>
  <Subtitle
    title="MOO Songlist_歌单"
    clickable
    url="./songlist/songlist"
  />

  <Songlist
    :songlist="newSonglist"
    @click="toPlaylist"
  />
</template>

<script setup lang="ts">
import { getNewSonglist } from '@/api/home'
import type { Songlist } from '@/api/interface/Songlist'
import { rangeRandom } from '@/utils/util'

const newSonglist = shallowRef<Songlist[]>(new Array(4).fill({}))

fetchNewSonglist()

function toPlaylist(item: Songlist) {
  uni.navigateTo({
    url: `/sharedPages/playlist/playlist`,
    success: (res) => {
      res.eventChannel.emit('acceptSonglist', item)
    },
    fail: (err) => { console.error(err) }
  })
}

async function fetchNewSonglist() {
  const { playlists } = await getNewSonglist(rangeRandom(0, 100), 4)
  console.log('🚀 ~ file: NewSonglist.vue:17 ~ fetchNewSonglist ~ playlists:', playlists)

  newSonglist.value = playlists
}

defineExpose({
  fetchNewSonglist
})
</script>
