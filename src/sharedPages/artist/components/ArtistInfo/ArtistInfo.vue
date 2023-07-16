<template>
  <view class="relative z-10 p-[30rpx] mt-[-50rpx] mx-[28rpx] rounded-[20rpx] bg-black-1 text-[38rpx] flex flex-col items-center space-y-2 font-bold text-white-1">
    <JImage
      :src="artist.avatar + '?param=100y100'"
      width="140rpx"
      height="140rpx"
      radius="50%"
    />
    <text>{{ artist.name }}</text>

    <text class="line-clamp-6 text-grey-1 text-[34rpx]">{{ artist.briefDesc }}</text>

    <JIcon
      type="icon-heart"
      size="60rpx"
      :custom-class="isCollect ? 'text-red-1 animate-ping !repeat-1' : 'text-grey-1 transition-colors'"
      @click="onCollect"
    />
  </view>
</template>

<script setup lang="ts">
import type { Artist } from '@/api/interface/Artist'

const props = defineProps<{
  artist: Artist
}>()

const cacheStore = useCacheStore()

const isCollect = ref(!!cacheStore.collectArtists.find(v => v.id === props.artist.id))

function onCollect() {
  console.log('onCollect')
  if (isCollect.value) {
    const index = cacheStore.collectArtists.findIndex(v => v.id === props.artist.id)
    cacheStore.collectArtists.splice(index, 1)
  } else {
    cacheStore.collectArtists.unshift(props.artist)
  }

  isCollect.value = !isCollect.value
}
</script>
