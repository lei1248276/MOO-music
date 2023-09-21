<template>
  <!-- #ifdef H5 -->
  <H5BackTransition
    :ref="(el: any) => el?.open()"
    class="w-full !h-full"
  >
    <!-- #endif -->
    <view class="w-full h-full relative">
      <NavBack />

      <swiper
        class="w-full h-full"
        vertical
        circular
        :duration="200"
        :current="currentView"
        @change="onChangeView"
        @tap="audioStore.toggle"
      >
        <swiper-item
          v-for="(song, index) in playViews"
          :key="index"
          skip-hidden-item-layout
        >
          <JImage
            custom-class="relative after:block after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:bg-[rgba(0,0,0,.22)]"
            :src="song.al.picUrl + '?param=400y400'"
            width="100%"
            height="100%"
          />

          <template v-if="currentView === index">
            <Lyric :song-id="song.id" />

            <SongInfo
              :tags="audioStore?.playlist?.tags || ['热门', '流行', '另类']"
              :name="playViews[currentView].name"
              :singers="playViews[currentView].ar"
              :song="playViews[currentView]"
              @menu="onOpenPopup"
            />
          </template>
        </swiper-item>
      </swiper>

      <uni-popup
        ref="popup"
        type="top"
        @mask-click="onClosePopup"
      >
        <!-- ! uni-popup的子组件在小程序端会立即创建并且不会销毁，而其余端会在"open"后创建"close"后销毁 -->
        <PlaylistPopup
          v-if="isShowPopup"
          :song="playViews[currentView]"
          @change="initViews"
        />
      </uni-popup>

      <JIcon
        v-show="!audioStore.isPlay"
        custom-class="icon-audioPlay text-[100rpx] text-white-1 mid"
        @click="audioStore.toggle"
      />

      <!-- ! ios平台滑动到后台时会穿透导致触发swiper滚动，所以添加一个占位元素 -->
      <view class="w-full h-[var(--save-bottom)] absolute bottom-0 right-0 left-0" />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController v-show="!isShowPopup" />
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'
import NavBack from './components/NavBack/NavBack.vue'
import SongInfo from './components/SongInfo/SongInfo.vue'
import Lyric from './components/Lyric/Lyric.vue'
import PlaylistPopup from './components/PlaylistPopup/PlaylistPopup.vue'

const audioStore = useAudioStore()

const currentView = ref(1) // * 当前显示的view索引（默认显示中间的“View”）
const playViews = shallowReactive<Song[]>(new Array(3)) //! 只显示3个view，每次切歌动态更新下一个view

const popup = shallowRef<UniPopupInstance>()
const isShowPopup = ref(false) // * 是否显示播放列表

let isPassive = true // ! 用于判断是主动更新还是被动，避免循环调用（因为切歌会更新view，而更新view会切歌）

onHide(() => { popup.value?.close!(); isShowPopup.value = false }) //* 避免导致跳转页面无法滚动

// ! 初始化view
watch(() => audioStore.songs, () => { initViews() }, { immediate: true })

// * 监听切歌回调，进行被动更新
audioStore.$onAction(({ name, after }) => {
  if (!isPassive) return

  after(() => {
    switch (name) {
      case 'setPreSong': updatePrevView(toIndex(currentView.value - 1, playViews.length))
        break
      case 'setNextSong': updateNextView(toIndex(currentView.value + 1, playViews.length))
        break
    }
  })
})
// * 监听滑动回调，进行主动更新
function onChangeView({ detail: { current: to, source: isTouch }}: SwiperOnChangeEvent) {
  if (!isTouch) return

  isPassive = false

  const from = currentView.value
  if (from - to === -1 || from - to === 2) {
    audioStore.setNextSong()
    updateNextView(to)
  } else {
    audioStore.setPreSong()
    updatePrevView(to)
  }

  isPassive = true
}

function initViews(current = currentView.value) {
  const { currentSongIndex, songs } = audioStore
  const viewLen = playViews.length

  playViews[toIndex(current - 1, viewLen)] = songs[toIndex(currentSongIndex - 1, songs.length)]
  playViews[toIndex(current, viewLen)] = songs[currentSongIndex]
  playViews[toIndex(current + 1, viewLen)] = songs[toIndex(currentSongIndex + 1, songs.length)]
}

// * 向上滑动进入下一个view（播放下一首），并修改"to"的下一个view
function updateNextView(to: number) {
  const nextViewIndex = toIndex(to + 1, playViews.length)
  const nextSongIndex = toIndex(audioStore.currentSongIndex + 1, audioStore.songs.length)

  playViews[nextViewIndex] = audioStore.songs[nextSongIndex]
  currentView.value = to
}

// * 向下滑动进入上一个view（播放上一首），并修改"to"的上一个view
function updatePrevView(to: number) {
  const prevViewIndex = toIndex(to - 1, playViews.length)
  const prevSongIndex = toIndex(audioStore.currentSongIndex - 1, audioStore.songs.length)

  playViews[prevViewIndex] = audioStore.songs[prevSongIndex]
  currentView.value = to
}

function toIndex(to: number, length: number) {
  if (to < 0) return length - 1

  return to % length
}

function onOpenPopup() {
  isShowPopup.value = true
  popup.value?.open?.()
}

function onClosePopup() {
  setTimeout(() => { isShowPopup.value = false }, 333)
}

// #ifdef H5
onMounted(() => {
  setTimeout(() => {
    watch(currentView, (view) => {
      document.title = '🎵 ' + playViews[view]?.name + ' - ' + playViews[view]?.ar.reduce((acc, { name }) => (acc += name + '. '), '')
    }, { immediate: true })
  }, 500)
})
// #endif
</script>
