<template>
  <view class="text-grey-1 mb-[20rpx]">
    <view class="flex items-center mb-[20rpx]">
      <JImage
        :src="userinfo.avatarUrl + '?param=70y70'"
        width="80rpx"
        height="80rpx"
        radius="50%"
      />
      <text class="ml-2">{{ userinfo.nickname }}</text>
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
