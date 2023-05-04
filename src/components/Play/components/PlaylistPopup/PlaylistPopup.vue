<template>
  <uni-popup
    ref="popup"
    type="top"
    @mask-click="onClose"
  >
    <view class="relative z-20 box-border w-full h-[80vh] rounded-b-2xl pt-[100rpx] px-[28rpx] backdrop-blur">
      <view class="w-full pb-[50rpx]">
        <view class="flex items-center gap-x-[50rpx]">
          <JImage
            :src="song.al.picUrl"
            width="300rpx"
            height="300rpx"
            radius="12rpx"
            custom-class="flex-1"
          />

          <view class="flex-1">
            <view class="text-white-1 line-clamp-3 text-[48rpx]">
              {{ song.name }}
            </view>
            <view class="flex-1 text-grey-1 line-clamp-2 text-[38rpx]">
              <template
                v-for="(item, index) in song.ar"
                :key="index"
              >
                {{ item.name }}.
              </template>
            </view>
          </view>
        </view>

        <view class="flex justify-between items-center text-white-1 pt-[30rpx]">
          <JIcon custom-class="icon-download text-[60rpx]" />
          <JIcon custom-class="icon-send text-[60rpx]" />
          <JIcon custom-class="icon-message text-[60rpx]" />
          <JIcon custom-class="icon-album text-[60rpx]" />
        </view>
      </view>

      <template v-if="isShowed">
        <scroll-view
          class="h-[calc(100%_-_446rpx)]"
          scroll-y
          enable-passive
          scroll-anchoring
          scroll-with-animation
          :scroll-into-view="'_' + songs[currentIndex].id"
        >
          <Song
            v-for="(item, index) in songs"
            :id="'_' + item.id"
            :key="item.id"
            :song="item"
            :is-play="isPlay"
            :is-run="song.id === item.id"
            @click="onSong(index)"
          />
        </scroll-view>
      </template>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import type { Song } from '@/api/interface/Song'
import type { Playlist } from '@/api/interface/Playlist'
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'

const props = defineProps<{
  song: Song
  songs: Song[]
  currentIndex: number
  isPlay: boolean
  playlist?: Playlist
}>()
const emit = defineEmits<{
  (e: 'animationFinish'): void
  (e: 'change', song: Song, index: number): void
}>()

const popup = shallowRef<UniPopupInstance>()
const isShowed = ref(false)

onMounted(() => {
  popup.value?.open?.()
  setTimeout(() => { isShowed.value = true }, 333)
})

function onClose() {
  popup.value?.close?.()
  setTimeout(() => { emit('animationFinish') }, 1000)
}

function onSong(index: number) {
  emit('change', props.songs[index], index)
}
</script>
