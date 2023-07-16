<template>
  <view
    class="flex items-center"
    @tap="$emit('click')"
  >
    <JImage
      class="mr-5"
      :src="(artist.picUrl || artist.avatar) + '?param=100y100'"
      width="140rpx"
      height="140rpx"
      radius="50%"
    />
    <view class="flex-1 flex flex-col justify-around h-full">
      <text class="w-[420rpx] text-[38rpx] font-bold truncate text-white-1">{{ artist.name }}</text>
      <view class="w-[420rpx] space-x-1 text-[26rpx] truncate text-grey-1">
        <text v-if="artist.musicSize">
          歌曲：{{ artist.musicSize }}
        </text>
        <text v-if="artist.albumSize">
          专辑：{{ artist.albumSize }}
        </text>
        <text v-if="artist.mvSize">
          视频：{{ artist.mvSize }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface Artist {
  id: number
  name: string
  cover?: string
  avatar?: string
  picUrl?: string
  albumSize?: number
  musicSize?: number
  mvSize?: number
}

defineProps<{
  artist: Artist
}>()
defineEmits<{
  (e: 'click'): void
}>()
</script>
