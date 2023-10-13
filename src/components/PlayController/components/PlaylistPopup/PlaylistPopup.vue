<template>
  <view class="bg-black-2 rounded-tl-lg rounded-tr-lg overflow-hidden">
    <PlayQueue
      class="box-border px-[28rpx] h-[50vh]"
      save-area
    >
      <template #default="{list}">
        <Subtitle class="bg-black-2">
          <template #title>
            <view class="flex items-center">
              <button
                class="h-[64rpx] !leading-[64rpx] m-0 rounded-full bg-yellow-1 text-black-1"
                size="mini"
                @tap="audioStore.setCurrentSong(list[0], 0)"
              >
                <JIcon class="icon-play text-[42rpx]" />
              </button>

              <text class="text-grey-1 inline-block align-middle ml-5 font-[38rpx]">
                {{ audioStore.songs.length }}
              </text>
            </view>
          </template>

          <template #icon>
            <JIcon
              :class="[
                audioStore.currentSongInfo ? 'icon-associate': 'pointer-events-none',
                audioStore.associationSong?.id === audioStore.currentSongInfo?.song.id ? 'text-yellow-1' : 'text-white-1'
              ]"
              class="text-[50rpx] transition-all duration-300"
              @click="onAssociate(audioStore.currentSongInfo?.song)"
            />
          </template>
        </Subtitle>
      </template>
    </PlayQueue>
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import { getSimiSongs } from '@/api/play'

const audioStore = useAudioStore()

async function onAssociate(song?: Song) {
  if (!song || song.id === audioStore.associationSong?.id) return

  const songs = await getSimiSongs(song.id)
  console.log('🚀 ~ file: PlaylistPopup.vue:50 ~ onAssociate ~ songs:', songs)

  audioStore.associationSong = song
  audioStore.currentSongIndex = 0
  audioStore.songs = [song, ...songs]
}
</script>
