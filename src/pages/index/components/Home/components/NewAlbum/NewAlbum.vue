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
    @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
  />
</template>

<script setup lang="ts">
import { getNewAlbum } from '@/api/home'
import type { Album } from '@/api/interface/NewAlbum'

const newAlbum = shallowRef<Album[]>([])

fetchNewAlbum()

async function fetchNewAlbum() {
  const { albums } = await getNewAlbum()
  console.log('🚀 ~ file: NewAlbum.vue:47 ~ getNewAlbum ~ albums:', albums)

  newAlbum.value = albums
}

</script>
