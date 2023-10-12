<template>
  <!-- #ifdef H5 -->
  <H5BackTransition
    :ref="(el: any) => el?.open()"
    class="w-full !h-full"
  >
    <!-- #endif -->
    <!-- ! ios平台滑动到后台时会穿透导致触发swiper滚动，所以添加一个占位伪元素 -->
    <view class="w-full h-full relative before:w-full before:h-[var(--save-bottom)] before:absolute before:bottom-0 before:right-0 before:left-0 before:z-10">
      <NavBack />

      <VirtualSwiper
        class="w-full h-full"
        :data="audioStore.songs"
        :current-data="audioStore.currentSongIndex"
        vertical
        circular
        skip-hidden-item-layout
        :duration="200"
        @tap="audioStore.toggle"
        @next="audioStore.setNextSong"
        @previous="audioStore.setPreSong"
      >
        <template #default="{item: song}">
          <JImage
            class="relative after:block after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:bg-[rgba(0,0,0,.22)]"
            :src="song.al.picUrl + '?param=400y400'"
            width="100vw"
            height="100vh"
          />
        </template>

        <template #current="{item: currentSong}">
          <Lyric :song-id="currentSong.id" />

          <SongInfo
            :tags="audioStore?.playlist?.tags || ['热门', '流行', '另类']"
            :name="currentSong.name"
            :singers="currentSong.ar"
            :song="currentSong"
            @menu="onOpenPopup"
          />
        </template>
      </VirtualSwiper>

      <uni-popup
        ref="popup"
        type="top"
        @mask-click="onClosePopup"
      >
        <!-- ! uni-popup的子组件在小程序端会立即创建并且不会销毁，而其余端会在"open"后创建"close"后销毁 -->
        <PlaylistPopup
          v-if="isShowPopup"
          :song="audioStore.currentSongInfo!.song"
          @change="onClosePopup"
        />
      </uni-popup>

      <JIcon
        v-show="!audioStore.isPlay"
        custom-class="icon-audioPlay text-[100rpx] text-white-1 mid"
        @click="audioStore.toggle"
      />

      <PlayProgress />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController v-show="!isShowPopup" />
</template>

<script setup lang="ts">
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'
import NavBack from './components/NavBack/NavBack.vue'
import SongInfo from './components/SongInfo/SongInfo.vue'
import Lyric from './components/Lyric/Lyric.vue'
import PlaylistPopup from './components/PlaylistPopup/PlaylistPopup.vue'
import PlayProgress from './components/PlayProgress/PlayProgress.vue'
import VirtualSwiper from '@/components/VirtualSwiper/VirtualSwiper.vue'

const audioStore = useAudioStore()

const popup = shallowRef<UniPopupInstance>()
const isShowPopup = ref(false) // * 是否显示播放列表

// #ifdef H5
onMounted(() => {
  watch(() => audioStore.currentSongInfo, (songInfo) => {
    document.title = '🎵 ' + songInfo?.song.name + ' - ' + songInfo?.song.ar.reduce((acc, { name }) => (acc += name + '. '), '')
  }, { immediate: true })
})
onHide(() => { //! popup不关闭的话会导致跳转页面无法滚动
  onClosePopup()
})
// #endif

function onOpenPopup() {
  isShowPopup.value = true
  popup.value?.open?.()
}

function onClosePopup() {
  popup.value?.close!()
  setTimeout(() => { isShowPopup.value = false }, 333)
}
</script>
