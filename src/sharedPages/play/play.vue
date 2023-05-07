<template>
  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="w-screen h-screen relative">
      <NavBack @back="isShowPage = false" />

      <swiper
        class="w-full h-full"
        vertical
        circular
        :duration="200"
        :current="currentView"
        @change="onChangeView"
        @click="audioStore.toggle"
      >
        <swiper-item
          v-for="(song, index) in playViews"
          :key="index"
          skip-hidden-item-layout
        >
          <JImage
            custom-class="relative after:block after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:bg-[rgba(0,0,0,.22)]"
            :src="song.al.picUrl + '?param=400y400'"
            width="100%"
            height="100%"
          />

          <Lyric
            v-if="currentView === index"
            :song-id="song.id"
          />
        </swiper-item>
      </swiper>

      <template v-if="playViews[currentView]">
        <SongInfo
          :tags="audioStore?.playlist?.tags || []"
          :name="playViews[currentView].name"
          :singers=" playViews[currentView].ar"
          :song-id="playViews[currentView].id"
          @menu="isShowPlaylist = true"
        />

        <PlaylistPopup
          v-if="isShowPlaylist"
          v-model:is-show="isShowPlaylist"
          :song="playViews[currentView]"
          @change="updateView"
        />
      </template>

      <JIcon
        v-show="!audioStore.isPlay"
        custom-class="icon-audioPlay text-[100rpx] text-white-1 mid"
        @click="audioStore.toggle"
      />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController @record="onPlayController" />
</template>

<script setup lang="ts">
import type { Song } from '@/api/interface/Song'
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'
import NavBack from './components/NavBack/NavBack.vue'
import SongInfo from './components/SongInfo/SongInfo.vue'
import Lyric from './components/Lyric/Lyric.vue'
import PlaylistPopup from './components/PlaylistPopup/PlaylistPopup.vue'

const audioStore = useAudioStore()

const currentView = ref(1) // * 当前显示的view索引
const playViews = shallowReactive<Song[]>([]) // * 播放view对应playlist中的指针
const isShowPlaylist = ref(false) // * 是否显示播放列表

// #ifdef H5
const isShowPage = ref(true)
// #endif

function onPlayController(isStop: (is: boolean) => boolean) {
  // * 在播放列表弹窗开启的情况下点击controller（或误操作），先执行关闭列表弹窗
  if (isShowPlaylist.value) return isStop(!(isShowPlaylist.value = false))

  // #ifdef H5
  isShowPage.value = false // * 为了保证H5端退出时有过渡效果
  // #endif

  // #ifndef H5
  uni.navigateBack()
  // #endif

  return isStop(true) // * 取消点击controller的默认行为
}

// #ifndef MP-WEIXIN
onBackPress(() => { // * 在播放列表弹窗开启的情况下进行返回操作（或误操作），先执行关闭列表弹窗
  if (isShowPlaylist.value) return !(isShowPlaylist.value = false)
})
// #endif

// * 初始化view
updateView()

// * 监听切歌回调，进行被动更新
uni.$on('onPreSong', () => {
  if (!isPassive) return

  const oldViewIndex = currentView.value
  const currentViewIndex = oldViewIndex === 0 ? 2 : oldViewIndex - 1

  updateView(oldViewIndex, currentViewIndex, true)
  currentView.value = currentViewIndex
  // console.log('🚀 onPreSong:', { oldViewIndex, currentViewIndex })
})
uni.$on('onNextSong', () => {
  if (!isPassive) return

  const oldViewIndex = currentView.value
  const currentViewIndex = oldViewIndex === 2 ? 0 : oldViewIndex + 1

  updateView(oldViewIndex, currentViewIndex, true)
  currentView.value = currentViewIndex
  // console.log('🚀 onNextSong:', { oldViewIndex, currentViewIndex })
})
onUnmounted(() => {
  uni.$off('onPreSong')
  uni.$off('onNextSong')
})

let isPassive = true // ! 用于主动更新时的标记（因为主动更新会切歌，而切歌会触发被动更新）
// * 监听滑动'view'进行主动更新
function onChangeView({ detail: { current, source }}: SwiperOnChangeEvent) {
  if (!source) return

  isPassive = false
  const oldViewIndex = currentView.value
  updateView(oldViewIndex, current)
  currentView.value = current
  isPassive = true
  // console.log('🚀 onChangeView:', { oldViewIndex, currentViewIndex: current })
}

// * 更新view：主要依赖2个数组,播放试图页面"playViews"和全局歌曲列表"songs"
// * passive: 主动滑动切歌/被动播放完毕自动下一曲
function updateView(from?: number, to?: number, passive = false) {
  if (!audioStore.songs.length) return

  const { songs } = audioStore
  const lastSongIndex = songs.length - 1

  if (from === undefined || to === undefined) {
    // * 初始化：切换"playlist"时创建所有"view"并归位"currentView：1"
    const { currentSongIndex } = audioStore
    const top = currentSongIndex === 0 ? lastSongIndex : currentSongIndex - 1
    const bottom = currentSongIndex === lastSongIndex ? 0 : currentSongIndex + 1
    const views = [songs[top], songs[currentSongIndex], songs[bottom]]

    views.forEach((v, i) => { playViews[i] = v })
    currentView.value = 1
  } else if (from - to === -1 || from - to === 2) {
    // * 向上滑动进入下一个view（播放下一首），并修改"to"的下一个view
    !passive && audioStore.setNextSong()
    const { currentSongIndex } = audioStore
    const nextView = to === 2 ? 0 : to + 1
    const nextViewSong = currentSongIndex === lastSongIndex ? 0 : currentSongIndex + 1

    playViews[nextView] = songs[nextViewSong]
  } else {
    // * 向下滑动进入上一个view（播放上一首），并修改"to"的上一个view
    !passive && audioStore.setPreSong()
    const { currentSongIndex } = audioStore
    const preView = to === 0 ? 2 : to - 1
    const preViewSong = currentSongIndex === 0 ? lastSongIndex : currentSongIndex - 1

    playViews[preView] = songs[preViewSong]
  }
}
</script>
