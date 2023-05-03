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
      @change="onChangeView"
      @click="audioStore.toggle"
    >
      <swiper-item
        v-for="(song, index) in playViews"
        :key="index"
        skip-hidden-item-layout
      >
        <JImage
          custom-class="relative after:block after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:bg-[rgba(0,0,0,.2)]"
          :src="song.al.picUrl"
          width="100%"
          height="100%"
        />

        <!-- <template v-if="currentView === index">
          <Lyric :song-id="song.id" />

          <SongInfo
            :tags="audioStore?.playlist?.tags || []"
            :name="song.name"
            :singers=" song.ar"
            :song-id="song.id"
            catch:menu="onShowPlaylist"
          />
        </template> -->
      </swiper-item>
    </swiper>

    <!-- <PlaylistPopup
      wx:if="{{ songs }}"
      is-show="{{ isShowPlaylist }}"
      playlist="{{ playlist }}"
      songs="{{ songs }}"
      song="{{ playViews[currentView] }}"
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
import type { SwiperOnChangeEvent } from '@uni-helper/uni-app-types'
// import SongInfo from './components/SongInfo/SongInfo.vue'
// import Lyric from './components/Lyric/Lyric.vue'

const audioStore = useAudioStore()

const currentView = ref(1) // * 当前显示的view索引
const playViews = ref<Song[]>([]) // * 播放view对应playlist中的指针
// const isShowPlaylist = ref(false)

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
  if (!audioStore.songs) return

  const { songs } = audioStore
  const lastSongIndex = songs.length - 1

  if (from === undefined || to === undefined) {
    // * 初始化：切换"playlist"时创建所有"view"并归位"currentView：1"
    const { currentSongIndex } = audioStore
    const top = currentSongIndex === 0 ? lastSongIndex : currentSongIndex - 1
    const bottom = currentSongIndex === lastSongIndex ? 0 : currentSongIndex + 1
    const views = [songs[top], songs[currentSongIndex], songs[bottom]]

    playViews.value = views
    currentView.value = 1
  } else if (from - to === -1 || from - to === 2) {
    // * 向上滑动进入下一个view（播放下一首），并修改"to"的下一个view
    !passive && audioStore.setNextSong()
    const { currentSongIndex } = audioStore
    const nextView = to === 2 ? 0 : to + 1
    const nextViewSong = currentSongIndex === lastSongIndex ? 0 : currentSongIndex + 1

    playViews.value[nextView] = songs[nextViewSong]
  } else {
    // * 向下滑动进入上一个view（播放上一首），并修改"to"的上一个view
    !passive && audioStore.setPreSong()
    const { currentSongIndex } = audioStore
    const preView = to === 0 ? 2 : to - 1
    const preViewSong = currentSongIndex === 0 ? lastSongIndex : currentSongIndex - 1

    playViews.value[preView] = songs[preViewSong]
  }
}
</script>
