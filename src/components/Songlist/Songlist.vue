<template>
  <view
    class="animate-enter-content w-auto flex justify-between flex-wrap overflow-hidden"
    :class="customClass"
  >
    <view
      v-for="item in songlist"
      :key="item.id"
      class="animate-content w-[48%] h-[420rpx] mb-[20rpx] rounded-[20rpx] font-bold text-white-1 relative"
      @click="toPlaylist(item)"
    >
      <JImage
        :src="item.coverImgUrl + '?param=200y200'"
        width="100%"
        height="322rpx"
        radius="20rpx"
        lazy-load
      />
      <JIcon custom-class="icon-music text-grey-2 text-[42rpx] bg-white-1 p-[4rpx] rounded-[50%] !absolute right-[3%] top-[60%]" />
      <text class="line-clamp-2">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Songlist } from '@/api/interface/Songlist'

defineProps<{
  songlist: Songlist[]
  customClass?: string
}>()

function toPlaylist(item: Songlist) {
  uni.navigateTo({
    url: `/sharedPages/playlist/playlist`,
    success: (res) => {
      res.eventChannel.emit('acceptSonglist', item)
    },
    fail: (err) => { console.error(err) }
  })
}
</script>
