<template>
  <view class="my-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1">热门歌手</view>
  <view class="flex flex-nowrap overflow-x-auto">
    <view
      v-for="artist in topArtists"
      :key="artist.id"
      class="mr-3"
      @tap="$emit('select', artist.name)"
    >
      <JImage
        :src="artist.picUrl + '?param=120y120'"
        width="120rpx"
        height="120rpx"
        radius="50%"
        lazy-load
      />
      <text class="inline-block text-center w-[120rpx] mt-1 text-grey-1 text-sm truncate">{{ artist.name }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Artist } from '@/api/interface/TopArtists'
import { getTopArtists } from '@/api/search'

defineEmits<{
  (e: 'select', name: string): void
}>()

const topArtists = shallowRef<Artist[]>()

fetchTopArtists()
async function fetchTopArtists() {
  const { artists } = await getTopArtists()
  console.log('🚀 ~ file: Search.vue:46 ~ fetchTopArtists ~ artists:', artists)
  topArtists.value = artists
}
</script>
