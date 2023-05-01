<template>
  <view class="w-screen h-full box-border px-[28rpx]">
    <view class="h-[300rpx] p-[30rpx] rounded-[20rpx] bg-black-1 text-[38rpx] box-border flex flex-col justify-between font-bold">
      <view class="text-white-1">
        <JIcon custom-class="icon-user mr-[20rpx]" />
        <text class="name">Jaye</text>
      </view>
    <!--<view class="flex justify-between items-center text-grey-1">
      <view class="text">
        <text>关注</text>
        <text class="count">0</text>
      </view>
      <view class="text">
        <text>粉丝</text>
        <text class="count">0</text>
      </view>
      <view class="vip">
        <text class="text">免费VIP活动</text>
      </view>
    </view>-->
    </view>

    <view class="flex flex-wrap justify-around items-center mt-5">
      <Shelf
        v-for="item in shelf"
        :key="item.description"
        :description="item.description"
        :count="item.count"
        :icon="item.icon"
        :list="item.list"
        :url="item.url"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IShelf } from './components/Shelf/Shelf.vue'
import Shelf from './components/Shelf/Shelf.vue'

const shelf = ref<IShelf[]>([
  { description: '收藏音乐', count: 0, icon: 'heart', list: [], url: './profile/collectSongs/index' },
  { description: '收藏歌单', count: 0, icon: 'playlist', list: [], url: './profile/collectPlaylist/index' },
  { description: '本地歌曲', count: 0, icon: 'file', list: [], url: '' },
  { description: '最近播放', count: 0, icon: 'time', list: [], url: './profile/historyPlays/index' }
])
</script>
