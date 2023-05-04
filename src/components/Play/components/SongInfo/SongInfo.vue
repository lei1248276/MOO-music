<template>
  <view class="w-[80%] absolute left-[50%] bottom-[18%] translate-x-[-50%] translate-y-[-10%]">
    <button
      v-for="(tag, index) in tags"
      :key="index"
      size="mini"
      class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx] mb-[20rpx]"
    >
      {{ tag }}
    </button>

    <view class="flex flex-col justify-between gap-5 mt-[20rpx] text-white-1 font-bold">
      <view class="flex justify-between items-center">
        <view class="text-[48rpx] mr-[20rpx]">{{ name }}</view>
        <JIcon
          :color="isCollect ? 'text-red-1' : 'text-white-1'"
          custom-class="icon-heart text-[60rpx]"
          @click="onCollect"
        />
      </view>
      <view class="flex justify-between items-center">
        <view class="flex-1 truncate text-[38rpx] mr-[20rpx]">
          <template
            v-for="item in singers"
            :key="item.name"
          >
            {{ item.name }}.
          </template>
        </view>
        <JIcon
          custom-class="icon-menu text-[66rpx]"
          @click="$emit('menu')"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'

defineProps<{
  tags: Playlist['tags']
  name: string
  singers: Song['ar']
  songId: number
}>()
defineEmits(['menu'])

const isCollect = ref(false)

function onCollect() {

}
</script>
