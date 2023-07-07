<template>
  <uni-popup
    ref="popup"
    type="top"
    @mask-click="onClose"
  >
    <view class="relative z-20 box-border w-full h-[80vh] rounded-b-2xl pt-[100rpx] px-[28rpx] backdrop-blur">
      <view class="w-full pb-[50rpx]">
        <view class="flex items-center">
          <JImage
            :src="song.al.picUrl + '?param=200y200'"
            width="300rpx"
            height="300rpx"
            radius="12rpx"
            custom-class="flex-1"
          />

          <view class="flex-1 ml-[50rpx]">
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
          <JIcon
            v-if="audioStore.playlist"
            custom-class="icon-playlist text-[60rpx]"
            @click="toPlaylist"
          />
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
          :scroll-into-view="'_' + audioStore.songs[audioStore.currentSongIndex].id"
          :upper-threshold="500"
          :lower-threshold="500"
          @scrolltoupper="onScrollToUpper"
          @scrolltolower="onScrollToLower"
        >
          <Song
            v-for="item in lazyList"
            :id="'_' + item.id"
            :key="item.id"
            :song="item"
            :is-play="audioStore.isPlay"
            :is-run="song.id === item.id"
            @click="onSong(item.id)"
          />
        </scroll-view>
      </template>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'
import { throttle } from '@/utils/util'

const props = defineProps<{
  isShow: boolean
  song: Song
}>()
const emit = defineEmits<{
  (e: 'animationFinish'): void
  (e: 'change'): void
  (e: 'update:isShow', isShow: boolean): void
}>()

const audioStore = useAudioStore()

const popup = shallowRef<UniPopupInstance>()
const isShowed = ref(false)

onMounted(() => {
  watch(() => props.isShow, isShow => {
    if (!isShow) return onClose()

    popup.value?.open?.()
    setTimeout(() => { isShowed.value = true }, 333)
  }, { immediate: true })
})

function onClose() {
  popup.value?.close?.()
  setTimeout(() => {
    emit('update:isShow', false)
    emit('animationFinish')
  }, 333)
}

function onSong(id: number) {
  const index = audioStore.songs.findIndex(v => v.id === id)
  audioStore.setCurrentSong(audioStore.songs[index], index)
  emit('change')
}

// * 根据滚动方向来动态改变对应的指针‘offset’
const limit = 5
let topOffset = 0
// ! ios全端向上滚加载更多都会发生偏移，暂时禁用向上滚懒加载
// let topOffset = audioStore.currentSongIndex < limit ? 0 : audioStore.currentSongIndex - limit
let bottomOffset = audioStore.currentSongIndex + limit
const lazyList = shallowReactive<Song[]>(audioStore.songs.slice(topOffset, bottomOffset))

// * 向上滚加载更多
const onScrollToUpper = throttle(function onScrollToUpper() {
  const start = topOffset <= limit ? topOffset - topOffset : topOffset - limit
  if (topOffset === start || topOffset <= 0) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToUpper', { topOffset, start })

  lazyList.unshift(...audioStore.songs.slice(start, topOffset))
  topOffset = start
}, 100)

// * 向下滚加载更多
function onScrollToLower() {
  const end = bottomOffset + limit
  if (bottomOffset === end || bottomOffset >= audioStore.songs.length - 1) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToLower', { bottomOffset, end })

  lazyList.push(...audioStore.songs.slice(bottomOffset, end))
  bottomOffset = end
}

function toPlaylist() {
  const routes = getCurrentPages()
  const from = routes[routes.length - 2]
  const isPlaylist = from.route === 'sharedPages/playlist/playlist'

  // @ts-ignore
  if (isPlaylist && Number(from.$page?.options?.id) === audioStore.playlist?.id) {
    onClose()
    return uni.navigateBack()
  }

  uni.navigateTo({
    url: `/sharedPages/playlist/playlist?id=${audioStore.playlist?.id}`,
    success: (res) => {
      res.eventChannel.emit('acceptPlaylist', audioStore.playlist)
      onClose()
    },
    fail: (err) => { console.error(err) }
  })
}
</script>
