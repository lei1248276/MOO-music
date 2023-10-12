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

    <scroll-view
      class="h-[calc(100%_-_446rpx)]"
      scroll-y
      enable-passive
      scroll-anchoring
      scroll-with-animation
      :scroll-into-view="scrollIntoView"
      :lower-threshold="500"
      @scrolltolower="onScrollToLower"
    >
      <Song
        v-for="item in lazyList"
        :id="'_' + item.id"
        :key="item.id"
        :song="item"
        :is-play="audioStore.currentSongInfo?.song.id === item.id && audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === item.id"
        :cannot-play="audioStore.currentSongInfo?.song.id === item.id && !audioStore.currentSongInfo?.urlInfo.url"
        @click="onSong(item.id)"
      />

      <template v-if="lazyList.length === 1">
        <view class="text-lg text-white-1 font-bold text-center [border-bottom:1px_dashed] mb-5">歌曲联想</view>

        <Song
          v-for="(item, index) in simiSongs"
          :id="'_' + item.id"
          :key="item.id"
          :song="item"
          :is-play="audioStore.currentSongInfo?.song.id === item.id && audioStore.isPlay"
          :is-run="audioStore.currentSongInfo?.song.id === item.id"
          :cannot-play="audioStore.currentSongInfo?.song.id === item.id && !audioStore.currentSongInfo?.urlInfo.url"
          @click="onSimiSong(index)"
        />
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import { getSimiSongs } from '@/api/play'
import { sleep } from '@/utils/util'

defineProps<{ song: Song }>()
const emit = defineEmits<{ (e: 'change'): void }>()

const audioStore = useAudioStore()

const scrollIntoView = ref('')

onMounted(async() => {
  await sleep(333) //* 等待“333ms”后再加载歌曲列表，因为popup动画会持续300ms

  watch(() => audioStore.currentSongIndex, (index) => {
    scrollIntoView.value = '_' + audioStore.songs[index].id
  }, { immediate: true })

  if (lazyList.length === 1) fetchSimiSongs(lazyList[0].id)
})

// * 根据滚动方向来动态改变对应的指针‘offset’
const limit = 5
// ! ios全端向上滚加载更多都会发生偏移，暂时禁用向上滚动加载
const topOffset = audioStore.currentSongIndex < limit * 2 ? 0 : audioStore.currentSongIndex - limit * 2
let bottomOffset = audioStore.currentSongIndex + limit
const lazyList = shallowReactive<Song[]>(audioStore.songs.slice(topOffset, bottomOffset))
const simiSongs = shallowRef<Song[]>([]) // * 相似歌曲列表

// * 向上滚加载更多
/* const onScrollToUpper = function onScrollToUpper() {
  const start = topOffset <= limit ? topOffset - topOffset : topOffset - limit
  if (topOffset === start || topOffset <= 0) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToUpper', { topOffset, start })

  lazyList.unshift(...audioStore.songs.slice(start, topOffset))
  topOffset = start
} */

// * 向下滚加载更多
function onScrollToLower() {
  const end = bottomOffset + limit
  if (bottomOffset === end || bottomOffset >= audioStore.songs.length - 1) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToLower', { bottomOffset, end })

  lazyList.push(...audioStore.songs.slice(bottomOffset, end))
  bottomOffset = end
}

function onSong(id: number) {
  const index = audioStore.songs.findIndex(v => v.id === id)
  audioStore.setCurrentSong(audioStore.songs[index], index)
  emit('change')
}

function onSimiSong(index: number) {
  audioStore.onPlay(index, simiSongs.value)
  emit('change')
}

async function fetchSimiSongs(id: number) {
  const { songs } = await getSimiSongs(id)
  console.log('🚀 ~ file: PlaylistPopup.vue:165 ~ fetchSimiSongs ~ songs:', songs)
  simiSongs.value = songs.map(song => ({
    id: song.id,
    name: song.name,
    ar: song.artists,
    al: song.album
  }))
}
</script>
