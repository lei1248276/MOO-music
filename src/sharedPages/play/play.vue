<template>
  <!-- #ifdef H5 -->
  <H5BackTransition
    :show="isShowPage"
    class="w-full !h-full"
  >
    <!-- #endif -->
    <view class="w-full h-full relative">
      <NavBack @back="isShowPage = false" />

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
              @menu="isShowPlaylist = true"
            />
          </template>
        </swiper-item>
      </swiper>

      <PlaylistPopup
        v-if="isShowPlaylist"
        v-model:is-show="isShowPlaylist"
        :song="playViews[currentView]"
        @change="initViews"
      />

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

  <PlayController @record="onPlayController" />
</template>

<script setup lang="ts">
import type { Song } from '@/components/Song/Song.vue'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'
import NavBack from './components/NavBack/NavBack.vue'
import SongInfo from './components/SongInfo/SongInfo.vue'
import Lyric from './components/Lyric/Lyric.vue'
import PlaylistPopup from './components/PlaylistPopup/PlaylistPopup.vue'

const audioStore = useAudioStore()

const currentView = ref(1) // * 当前显示的view索引（默认显示中间的“View”）
const playViews = shallowReactive<Song[]>(new Array(3)) // ! 只显示3个view，每次切歌动态更新下一个view
const isShowPlaylist = ref(false) // * 是否显示播放列表

// #ifdef H5
const isShowPage = ref(true)
// #endif

function onPlayController(isStop: (is: boolean) => boolean) {
  // * 在播放列表弹窗开启的情况下点击controller（或误操作），先执行关闭列表弹窗
  if (isShowPlaylist.value) return isStop(!(isShowPlaylist.value = false))

  // #ifdef H5
  isShowPage.value = false // * H5端特有返回，为了保证H5端退出时有过渡效果
  // #endif

  // #ifndef H5
  uni.navigateBack() // * 不是H5端执行正常返回
  // #endif

  return isStop(true) // * 取消点击controller的默认行为
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

// ! 初始化view
initViews()

let isPassive = true // ! 用于判断是主动更新还是被动，避免循环调用（因为切歌会更新view，而更新view会切歌）

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

function initViews() {
  const { currentSongIndex } = audioStore
  const { songs } = audioStore
  const songsLen = songs.length

  playViews[0] = songs[toIndex(currentSongIndex - 1, songsLen)]
  playViews[1] = songs[currentSongIndex]
  playViews[2] = songs[toIndex(currentSongIndex + 1, songsLen)]
  currentView.value = 1
}

// * 向上滑动进入下一个view（播放下一首），并修改"to"的下一个view
function updateNextView(to: number) {
  const { currentSongIndex } = audioStore
  const { songs } = audioStore
  const songsLen = songs.length
  const viewsLen = playViews.length

  const nextViewIndex = toIndex(to + 1, viewsLen)
  const nextSongIndex = toIndex(currentSongIndex + 1, songsLen)

  playViews[nextViewIndex] = songs[nextSongIndex]
  currentView.value = to
}

// * 向下滑动进入上一个view（播放上一首），并修改"to"的上一个view
function updatePrevView(to: number) {
  const { currentSongIndex } = audioStore
  const { songs } = audioStore
  const songsLen = songs.length
  const viewsLen = playViews.length

  const prevViewIndex = toIndex(to - 1, viewsLen)
  const prevSongIndex = toIndex(currentSongIndex - 1, songsLen)

  playViews[prevViewIndex] = songs[prevSongIndex]
  currentView.value = to
}

function toIndex(to: number, length: number) {
  if (to < 0) return length - 1

  return to % (length + length) % length
}
</script>
