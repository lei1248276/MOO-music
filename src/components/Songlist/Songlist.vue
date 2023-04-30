<template>
  <view
    class="w-auto gap-[20rpx] flex justify-between flex-wrap overflow-hidden"
    :class="customClass"
  >
    <view
      v-for="item in songlist"
      :key="item.id"
      class="w-[48%] h-[420rpx] rounded-[20rpx] font-bold text-white-1 relative"
      @click="toPlaylist(item)"
    >
      <JImage
        :src="item.coverImgUrl"
        width="100%"
        height="322rpx"
        radius="20rpx"
      />
      <uni-icons
        custom-prefix="iconfont"
        type="icon-music"
        class="!text-grey-2 !text-[42rpx] bg-white-1 p-[4rpx] rounded-[50%] absolute right-[3%] top-[60%]"
      />
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
    url: `/sharedPages/playlist`,
    success: (res) => {
      res.eventChannel.emit('acceptSonglist', item)
    },
    fail: (err) => { console.error(err) }
  })
}
</script>
