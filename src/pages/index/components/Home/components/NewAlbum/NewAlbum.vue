<template>
  <Subtitle
    title="MOO Album_专辑"
    clickable
    url="./albumList/albumList"
  />

  <Album
    v-for="album in newAlbum.slice(0, 3)"
    :key="album.id"
    :album="album"
    @click="toAlbum(album.id)"
  />
</template>

<script setup lang="ts">
import { getNewAlbum } from '@/api/home'
import type { Album } from '@/api/interface/NewAlbum'

const newAlbum = shallowRef<Album[]>([])

fetchNewAlbum()

function toAlbum(id: number) {
  uni.navigateTo({
    url: `/sharedPages/album/album?id=${id}`,
    fail(err) { console.error(err) }
  })
}

async function fetchNewAlbum() {
  const { albums } = await getNewAlbum()
  console.log('🚀 ~ file: NewAlbum.vue:47 ~ getNewAlbum ~ albums:', albums)

  newAlbum.value = albums
}

</script>
