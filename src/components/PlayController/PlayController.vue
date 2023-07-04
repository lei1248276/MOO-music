<template>
  <view
    v-show="!hidden"
    class="h-[110rpx] px-[30rpx] rounded-[60rpx] fixed bottom-[4%] left-[6%] z-[999] box-border flex justify-between items-center bg-black-1 mb-[env(safe-area-inset-bottom)]"
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

    <JIcon
      :type="audioStore.isPlay ? 'icon-audioPause' : 'icon-audioPlay'"
      custom-class="text-white-1 text-[60rpx]"
    />

    <!-- ! 隐形的占位事件触发元素，避免icon覆盖movable -->
    <view
      class="absolute right-0 z-50 bg-yellow-1 opacity-0 w-[100rpx] h-full"
      @tap="audioStore.toggle"
    />
  </view>
</template>

<script setup lang="ts">
import type { MovableViewOnChangeEvent } from '@uni-helper/uni-app-types'

const emit = defineEmits<{
  (e: 'record', isStop: (is: boolean) => boolean): void
}>()

const audioStore = useAudioStore()

const area = 450
const size = 130
const pivot = (area / 2) - (size / 2) // * 中心点
let moved = -1 // * 被移动的距离

const hidden = ref(false)
const x = ref(pivot)

onShow(() => { hidden.value = false })
onHide(() => { hidden.value = true })

function toPlay() {
  if (!audioStore.currentSongInfo) return

  // * 通过自定义事件的参数回调来确认是否取消后续默认行为
  let isStop
  emit('record', (is) => (isStop = is))
  if (isStop) return

  // * 默认点击跳转到"play"页面，如果上一页面就是"play"那么直接返回
  uni.navigateTo({
    url: `/sharedPages/play/play`,
    fail: (err) => { console.error(err) }
  })
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
  x.value = moved - 1
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
</script>
