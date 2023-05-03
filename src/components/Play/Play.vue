<template>
  <view class="w-screen h-screen relative">
    <!-- <NavBar
      title=""
      left-arrow
      placeholder="{{ false }}"
      custom-style="background: transparent;"
      icon-style="color: #fffeff;"
      bind:back="onBack"
    /> -->

    <swiper
      class="w-full h-full"
      vertical
      circular
      :duration="200"
      :current="currentView"
      @animationfinish="onChangeView"
      @click="audioStore.toggle"
    >
      <swiper-item
        v-for="(song, index) in playView"
        :key="index"
        skip-hidden-item-layout
      >
        <JImage
          custom-class="relative after:block after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:bg-[rgba(0,0,0,.2)]"
          :src="song.al.picUrl"
          width="100%"
          height="100%"
        />

        <template v-if="currentView === index">
          <!-- <Lyric song-id="{{ song.id }}" /> -->

          <!-- <SongInfo
            :tags="audioStore?.playlist?.tags || []"
            :name="song.name"
            :singers=" song.ar"
            :song-id="song.id"
            catch:menu="onShowPlaylist"
          /> -->
        </template>
      </swiper-item>
    </swiper>

    <!-- <PlaylistPopup
      wx:if="{{ songs }}"
      is-show="{{ isShowPlaylist }}"
      playlist="{{ playlist }}"
      songs="{{ songs }}"
      song="{{ playView[currentView] }}"
      current-index="{{ currentSongIndex }}"
      bind:close="onShowPlaylist"
      bind:change="updateView"
    /> -->

    <JIcon
      v-show="!audioStore.isPlay"
      custom-class="icon-audioPlay text-[100rpx] text-white-1 mid"
      @click="audioStore.toggle"
    />
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/api/interface/Song'
import type { SwiperOnAnimationfinishEvent } from '@uni-helper/uni-app-types'
import SongInfo from './SongInfo/SongInfo.vue'

const audioStore = useAudioStore()

const currentView = ref(1) // * 当前显示的view索引
const playView = ref<Song[]>([]) // * 播放view对应playlist中的指针
const isShowPlaylist = ref(false)

// * 初始化view
updateView()

function onChangeView({ detail: { current, source }}: SwiperOnAnimationfinishEvent) {
  const oldView = currentView.value
  if (!source || oldView === current) return

  updateView(oldView, current)
  currentView.value = current
}
// ! 更新view：主要依赖2个数组：前进/后退播放页面"playView"和全局歌曲列表"songs"
// ! passive: 主动滑动切歌/被动播放完毕自动下一曲
function updateView(from?: number, to?: number, passive = false) {
  if (!audioStore.songs) return

  const { songs } = audioStore
  const lastSongIndex = songs.length - 1

  if (from === undefined || to === undefined) {
    // * 初始化：切换"playlist"时创建所有"view"并归位"currentView：1"
    const { currentSongIndex: current } = audioStore
    const top = current === 0 ? lastSongIndex : current - 1
    const bottom = current === lastSongIndex ? 0 : current + 1
    const views = [songs[top], songs[current], songs[bottom]]

    playView.value = views
    currentView.value = 1
  } else if (from - to === -1 || from - to === 2) {
    // * 向上滑动进入下一个view（播放下一首），并修改"to"的下一个view
    !passive && audioStore.setNextSong()
    const { currentSongIndex: current } = audioStore
    const nextView = to === 2 ? 0 : to + 1
    const nextViewSong = current === lastSongIndex ? 0 : current + 1

    playView.value[nextView] = songs[nextViewSong]
  } else {
    // * 向下滑动进入上一个view（播放上一首），并修改"to"的上一个view
    !passive && audioStore.setPreSong()
    const { currentSongIndex: current } = audioStore
    const preView = to === 0 ? 2 : to - 1
    const preViewSong = current === 0 ? lastSongIndex : current - 1

    playView.value[preView] = songs[preViewSong]
  }
}
</script>
