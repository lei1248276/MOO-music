<template>
  <Subtitle
    title="MOO Album_专辑"
    clickable
  />

  <view
    v-for="album in newAlbum"
    :key="album.albumId"
    class="flex items-stretch mb-5"
  >
    <view class="flex-1 flex items-center mr-[50rpx]">
      <JImage
        :src="album.coverUrl + '?param=200y200'"
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
      <text class="text-[38rpx] font-bold text-white-1 line-clamp-2">{{ album.albumName }}</text>
      <text class="text-[32rpx] text-grey-1">{{ album.artistName }}</text>
      <text class="inline-block px-4 py-1 text-[13px] text-black-1 font-bold bg-yellow-1 rounded-full m-0">
        Hot
      </text>
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
