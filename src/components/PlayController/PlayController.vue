<template>
  <view>
    <view
      v-show="!hidden"
      class="h-[110rpx] px-[30rpx] rounded-[60rpx] fixed bottom-[4%] left-[3%] z-[999] box-border flex justify-between items-center bg-black-1 mb-[var(--ios-bottom)]"
      :style="{ width: area + 'rpx'}"
    >
      <Countdown />

      <movable-area
        class="h-[110rpx] absolute left-0 top-0 z-10"
        :style="{ width: area + 'rpx'}"
      >
        <movable-view
          class="h-[110rpx] flex items-center"
          :style="{ width: size + 'rpx'}"
          :x="x + 'rpx'"
          direction="horizontal"
          @change="onMoveChange"
          @touchend.passive="onMoveEnd"
        >
          <JImage
            src="/static/record.png"
            :width="size + 'rpx'"
            :height="size + 'rpx'"
            class="will-change-transform"
            :class="audioStore.isLoading
              ? 'animate-bounce [animation-delay:400ms]'
              : audioStore.isPlay
                ? 'animate-spin [animation-duration:5s]'
                : 'animate-spin [animation-duration:5s] [animation-play-state:paused]'"
            @click="toPlay"
          />
        </movable-view>
      </movable-area>

      <view class="relative">
        <JIcon
          :type="audioStore.isPlay ? 'icon-audioPause' : 'icon-audioPlay'"
          class="text-white-1 text-[60rpx]"
        />
        <!-- ! 隐形的占位事件触发元素，因为播放控制icon被movable区域覆盖了 -->
        <view
          class="w-[60rpx] h-full absolute top-0 right-0 z-50 bg-yellow-1 opacity-0"
          @tap="audioStore.toggle"
        />
      </view>
    </view>

    <view class="h-[110rpx] px-[30rpx] rounded-[60rpx] fixed bottom-[4%] right-[3%] z-[999] box-border flex justify-between items-center bg-black-1 mb-[var(--ios-bottom)]">
      <JIcon
        type="icon-menu"
        class="text-white-1 text-[70rpx] font-bold mr-3"
        @click="onOpenPopup"
      />
      <uni-popup
        ref="popup"
        type="bottom"
        :safe-area="false"
        @mask-click="onClosePopup"
      >
        <PlaylistPopup v-if="isShowPopup" />
      </uni-popup>

      <JIcon
        :type="iconType"
        class="text-yellow-1 text-[70rpx]"
        @click="!audioStore.associationSong && audioStore.setPlayMode()"
      />
    </view>
  </view>
</template>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>
// #endif

<script setup lang="ts">
import type { MovableViewOnChangeEvent } from '@uni-helper/uni-app-types'
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'
import PlaylistPopup from './components/PlaylistPopup/PlaylistPopup.vue'

const emit = defineEmits<{
  (e: 'record', isStop: (is: boolean) => boolean): void
}>()

const audioStore = useAudioStore()

const area = 480
const size = 130
const pivot = (area / 2) - (size / 2) // * 中心点
let moved = -1 // * 被移动的距离

const hidden = ref(false)
const x = ref(pivot)

const popup = shallowRef<UniPopupInstance>()
const isShowPopup = ref(false)

//! 为了解决uni-popup组件进行更新，状态会发生重置的bug（导致自动关闭），所以在popup关闭后再更新"icon"
let _iconType = ''
const iconType = computed(() => {
  if (isShowPopup.value) return _iconType

  return (_iconType = !isShowPopup.value && audioStore.associationSong ? 'icon-associate' : `icon-${audioStore.mode}`)
})

onShow(() => { hidden.value = false })
onHide(() => { hidden.value = true; isShowPopup.value && onClosePopup() })

function toPlay() {
  if (!audioStore.currentSongInfo) return

  // * 通过自定义事件的参数回调来确认是否取消后续默认行为
  let isStop
  emit('record', (is) => (isStop = is))
  if (isStop) return

  // * 默认点击跳转到"play"页面，再次点击直接返回
  getCurrentPages().pop()?.route === 'sharedPages/play/play'
    ? uni.navigateBack()
    : useNavigateTo(`/sharedPages/play/play`)
}

function onMoveChange({ detail: { x, source }}: MovableViewOnChangeEvent) {
  if (!source) return

  moved = x
}

function onMoveEnd() {
  console.log('🚀 ~ file: PlayController.vue:63 ~ onMoveEnd ~ moved:', moved)
  // ! 误触直接退出
  if (moved === -1) return

  // * 滑动结束后手动归位（避免 moved === pivot 导致无法归位所以-1）
  x.value = -1
  setTimeout(() => {
    x.value = pivot
    moved = -1
  })

  const distance = pivot / 2 // * 可移动距离
  const limit = distance * 3 / 4 // * 触发的阈值
  const next = distance + limit // * 下一首
  const pre = distance - limit // * 上一首
  // console.log({ moved, pivot, distance, limit, next, pre })

  if (moved > next) {
    console.log('下一首')
    audioStore.setNextSong()
  } else if (moved < pre) {
    console.log('上一首')
    audioStore.setPreSong()
  }
}

function onOpenPopup() {
  if (!audioStore.songs.length) return
  isShowPopup.value = true
  popup.value?.open?.()
}

function onClosePopup() {
  popup.value?.close!()
  setTimeout(() => { isShowPopup.value = false }, 333)
}
</script>
