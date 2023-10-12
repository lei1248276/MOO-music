<template>
  <view
    class="flex items-stretch mb-5"
    @tap="$emit('click')"
  >
    <view class="flex-1 flex items-center mr-[50rpx]">
      <JImage
        :src="album.picUrl + '?param=200y200'"
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
      <text class="text-[38rpx] font-bold text-white-1 line-clamp-2">{{ album.name }}</text>
      <text
        class="text-[32rpx] text-grey-1 active:text-white-1"
        @tap.stop="useNavigateTo(`/sharedPages/artist/artist?id=${album.artist.id}`)"
      >
        {{ album.artist.name }}
      </text>
      <text class="inline-block px-4 py-1 text-[13px] text-black-1 font-bold bg-yellow-1 rounded-full m-0">
        Hot
      </text>
    </view>
  </view>
</template>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>
// #endif

<script setup lang="ts">
export interface Album {
  id: number
  name: string
  picUrl: string
  description: string
  artist: {
    id: number
    name: string
    picUrl: string
  }
}

defineProps<{
  album: Album
}>()
defineEmits<{
  (e: 'click'):void
}>()
</script>
