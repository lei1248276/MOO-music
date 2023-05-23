<template>
  <view class="w-full h-full box-border px-[28rpx]">
    <view class="h-[300rpx] p-[30rpx] rounded-[20rpx] bg-black-1 text-[38rpx] box-border flex flex-col justify-between font-bold">
      <view class="text-white-1">
        <JIcon custom-class="icon-user mr-[20rpx]" />
        <text class="name">Jaye</text>
      </view>
      <view class="flex justify-between items-center text-grey-1">
        <view class="flex-1">
          <text>关注</text>
          <text>0</text>
        </view>

        <view class="flex-1">
          <text>粉丝</text>
          <text>0</text>
        </view>

        <button
          size="mini"
          class="font-bold bg-yellow-1 text-black-1 rounded-full"
        >
          免费VIP活动
        </button>
      </view>
    </view>

    <view class="flex flex-wrap justify-around items-center mt-5">
      <Shelf
        v-for="(item, index) in shelf"
        :key="index"
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
import Shelf from './components/Shelf/Shelf.vue'

const cacheStore = useCacheStore()

const shelf = reactive([
  {
    description: '收藏音乐',
    count: computed(() => cacheStore.collectSongs.length),
    icon: 'heart',
    list: computed(() => ['', '', ''].map((v, i) => cacheStore.collectSongs[i]?.al.picUrl || v)),
    url: '../collectSongs/collectSongs'
  },
  {
    description: '收藏歌单',
    count: computed(() => cacheStore.collectPlaylist.length),
    icon: 'playlist',
    list: computed(() => ['', '', ''].map((v, i) => cacheStore.collectPlaylist[i]?.coverImgUrl || v)),
    url: '../collectPlaylist/collectPlaylist'
  },
  {
    description: '本地歌曲',
    count: 0,
    icon: 'file',
    list: ['', '', ''],
    url: ''
  },
  {
    description: '最近播放',
    count: computed(() => cacheStore.historyPlays.length),
    icon: 'time',
    list: computed(() => ['', '', ''].map((v, i) => cacheStore.historyPlays[i]?.al.picUrl || v)),
    url: '../historyPlays/historyPlays'
  }
])
</script>
