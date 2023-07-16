<template>
  <JImage
    :src="album.picUrl + '?param=300y300'"
    width="500rpx"
    height="450rpx"
    radius="20rpx"
    custom-class="m-auto mt-5"
  />

  <view class="pt-[40rpx]">
    <text class="inline-block text-grey-1 text-[28rpx]">
      更新于  {{ parseTime(album.publishTime, '{y}-{m}-{d}') }}
    </text>

    <view class="text-white-1 mb-[20rpx]">
      <view class="flex justify-between items-center">
        <text class="inline-block w-4/5 truncate text-[40rpx]">{{ album.name }}</text>

        <JIcon
          type="icon-heart"
          size="60rpx"
          :custom-class="isCollect ? 'text-red-1 animate-ping !repeat-1' : 'text-grey-1 transition-colors'"
          @click="onCollect"
        />
      </view>

      <view class="flex items-center my-[20rpx]">
        <JImage
          :src="album.artist.picUrl + '?param=70y70'"
          width="80rpx"
          height="80rpx"
          radius="50%"
        />
        <text
          class="ml-2 active:text-grey-1"
          @tap.stop="useNavigateTo(`/sharedPages/artist/artist?id=${album.artist.id}`)"
        >
          {{ album.artist.name }}
        </text>
      </view>

      <text class="line-clamp-6 text-[42rpx]">{{ album.description }}</text>

      <view class="mt-[20rpx] text-grey-2 text-[28rpx]">
        <text class="mr-3">分享 {{ album.info.shareCount }}</text>
        <text>喜欢 {{ album.info.likedCount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Album } from '@/api/interface/Album'
import { parseTime } from '@/utils/util'

const props = defineProps<{
  album: Album
}>()

const cacheStore = useCacheStore()

const isCollect = ref(!!cacheStore.collectAlbums.find(v => v.id === props.album.id))

function onCollect() {
  console.log('onCollect')
  if (isCollect.value) {
    const index = cacheStore.collectAlbums.findIndex(v => v.id === props.album.id)
    cacheStore.collectAlbums.splice(index, 1)
  } else {
    cacheStore.collectAlbums.unshift(props.album)
  }

  isCollect.value = !isCollect.value
}
</script>
