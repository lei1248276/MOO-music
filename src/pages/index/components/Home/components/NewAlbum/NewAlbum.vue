<template>
  <Subtitle
    title="MOO Album_专辑"
    clickable
  />

  <view
    v-for="album in newAlbum"
    :key="album.albumId"
    class="flex items-stretch gap-x-[50rpx] mb-5"
  >
    <view class="flex-1 flex items-center">
      <JImage
        :src="album.coverUrl"
        width="300rpx"
        height="300rpx"
        radius="12rpx"
        lazy-load
      />
      <JImage
        src="/static/cd.png"
        width="50rpx"
        height="200rpx"
        lazy-load
      />
    </view>

    <view class="flex-1 flex flex-col justify-evenly items-start">
      <text class="font-[38rpx] font-bold text-white-1 line-clamp-2">{{ album.albumName }}</text>
      <text class="font-[32rpx] text-grey-1">{{ album.artistName }}</text>
      <button
        size="mini"
        class="font-bold bg-yellow-1 text-black-1 rounded-full m-0"
      >
        #Hot
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getNewAlbum } from '@/api/home'
import type { Album } from '@/api/interface/Album'

const newAlbum = shallowRef<Album[]>([])

fetchNewAlbum()

async function fetchNewAlbum() {
  const { products } = await getNewAlbum()
  console.log('🚀 ~ file: NewAlbum.vue:47 ~ getNewAlbum ~ products:', products)

  newAlbum.value = products
}

</script>
