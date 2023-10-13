<template>
  <view class="relative z-20 box-border w-full h-[80vh] rounded-b-2xl pt-[100rpx] px-[28rpx] backdrop-blur">
    <view class="w-full pb-[50rpx]">
      <view class="flex items-center">
        <JImage
          :src="song.al.picUrl + '?param=200y200'"
          width="300rpx"
          height="300rpx"
          radius="12rpx"
          class="flex-1"
        />

        <view class="flex-1 ml-[50rpx]">
          <view class="text-white-1 line-clamp-3 text-[48rpx]">
            {{ song.name }}
          </view>
          <view class="flex-1 space-x-1 text-grey-1 line-clamp-2 text-[38rpx]">
            <text
              v-for="(item, index) in song.ar"
              :key="index"
              class="active:text-white-1"
              @tap.stop="useNavigateTo(`/sharedPages/artist/artist?id=${item.id}`)"
            >
              {{ item.name }}.
            </text>
          </view>
        </view>
      </view>

      <view class="flex justify-between items-center text-white-1 pt-[30rpx]">
        <JIcon class="icon-send text-[60rpx]" />
        <JIcon class="icon-download text-[60rpx]" />
        <JIcon
          v-if="audioStore.playlist"
          class="icon-playlist text-[60rpx]"
          @click="useNavigateTo(`/sharedPages/playlist/playlist?id=${audioStore.playlist?.id}`)"
        />
        <JIcon
          v-if="audioStore.currentSongInfo?.song"
          class="icon-album text-[60rpx]"
          @click="useNavigateTo(`/sharedPages/album/album?id=${song.al.id}`)"
        />
        <JIcon class="icon-message text-[60rpx]" />
      </view>
    </view>

    <PlayQueue
      class="h-[calc(100%_-_446rpx)]"
      @change="$emit('change')"
    />
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'

defineProps<{ song: Song }>()
defineEmits<{ (e: 'change'): void }>()

const audioStore = useAudioStore()
</script>
