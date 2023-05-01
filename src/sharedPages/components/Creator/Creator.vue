<template>
  <view class="text-grey-1 mb-[20rpx]">
    <view class="flex items-center gap-x-2 mb-[20rpx]">
      <JImage
        :src="userinfo.avatarUrl"
        width="80rpx"
        height="80rpx"
        radius="50%"
      />
      <text>{{ userinfo.nickname }}</text>
    </view>
    <view class="line-clamp-6">{{ userinfo.signature }}</view>
  </view>
</template>

<script setup lang="ts">
import type { Creator } from '@/api/interface/Playlist'

defineProps<{
  userinfo: Creator
}>()
</script>
