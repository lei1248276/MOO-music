
<template>
  <swiper
    :active-class="$props.activeClass"
    :changing-class="$props.changingClass"
    :autoplay="$props.autoplay"
    :current-item-id="$props.currentItemId"
    :interval="$props.interval"
    :duration="$props.duration"
    :circular="$props.circular"
    :vertical="$props.vertical"
    :previous-margin="$props.previousMargin"
    :next-margin="$props.nextMargin"
    :acceleration="$props.acceleration"
    :disable-programmatic-animation="$props.disableProgrammaticAnimation"
    :display-multiple-items="$props.displayMultipleItems"
    :skip-hidden-item-layout="$props.skipHiddenItemLayout"
    :disable-touch="$props.disableTouch"
    :touchable="$props.touchable"
    :easing-function="$props.easingFunction"
    :current="currentView"
    @change="onChangeView"
    @animationfinish="emit('animationfinish', $event)"
    @transition="emit('transition', $event)"
  >
    <swiper-item
      v-for="(item, index) in playViews"
      :key="index"
    >
      <slot :item="item" />

      <slot
        v-if="currentView === index"
        name="current"
        :item="item"
      />
    </swiper-item>
  </swiper>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup lang="ts">
import type { SwiperOnChangeEvent, SwiperOnTransitionEvent, SwiperOnAnimationfinishEvent } from '@uni-helper/uni-app-types'

export interface VirtualSwiperInstance {
  view: 0 | 1 | 2,
  playViews: [any, any, any],
  initViews: (current?: number) => void,
  updateNextView: (to?: number) => void,
  updatePrevView: (to?: number) => void
}

interface Props {
  activeClass?: string
  changingClass?: boolean
  autoplay?: boolean
  currentItemId?: string
  interval?: number
  duration?: number
  circular?: boolean
  vertical?: boolean
  previousMargin?: string
  nextMargin?: string
  acceleration?: boolean
  disableProgrammaticAnimation?: boolean
  displayMultipleItems?: number
  skipHiddenItemLayout?: boolean
  disableTouch?: boolean
  touchable?: boolean
  easingFunction?: 'default' | 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  view?: number //* 当前显示的view索引（默认显示中间的“View”）
  data: any[] //* 数据源
  currentData: number //* 当前数据索引
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'transition', event: SwiperOnTransitionEvent): void
  (e: 'animationfinish', event: SwiperOnAnimationfinishEvent): void
  (e: 'previous', index: number): void
  (e: 'next', index: number): void
}>()

const currentView = ref(props.view || 1) // * 当前显示的view索引（默认显示中间的“View”）
const playViews = reactive<[any, any, any]>([] as any) //! 只显示3个view，每次切歌动态更新下一个view

watch(() => props.data, () => { initViews() }, { immediate: true })

watch(() => props.currentData, (current, oldCurrent) => {
  if (props.data[current].id === playViews[currentView.value].id) return

  //* 监听被动切换（非滑动切换），先模拟滑动再更新views
  currentView.value = toIndex(current > oldCurrent ? currentView.value + 1 : currentView.value - 1, 3)
  initViews()
}, { flush: 'post' })

function onChangeView({ detail: { current: to, source: isTouch }}: SwiperOnChangeEvent) {
  if (!isTouch) return

  //* 监听主动切换（滑动切换），更新views
  const from = currentView.value
  if (from - to === -1 || from - to === 2) {
    emit('next', to)
    updateNextView(to)
  } else {
    emit('previous', to)
    updatePrevView(to)
  }
}

// ! 初始化view
function initViews(current = currentView.value) {
  nextTick(() => {
    const { currentData, data } = props

    playViews[toIndex(current - 1, 3)] = data[toIndex(currentData - 1, data.length)]
    playViews[toIndex(current, 3)] = data[currentData]
    playViews[toIndex(current + 1, 3)] = data[toIndex(currentData + 1, data.length)]
  })
}

function updateNextView(to: number = toIndex(currentView.value + 1, playViews.length)) {
  if (to === currentView.value) return

  currentView.value = to
  console.log('🚀 ~ file: VirtualSwiper.vue:99 ~ updateNextView ~ updateNextView:', to)

  nextTick(() => {
    const nextViewIndex = toIndex(to + 1, playViews.length)
    const nextSongIndex = toIndex(props.currentData + 1, props.data.length)

    playViews[nextViewIndex] = props.data[nextSongIndex]
  })
}

function updatePrevView(to: number = toIndex(currentView.value - 1, playViews.length)) {
  if (to === currentView.value) return

  currentView.value = to
  console.log('🚀 ~ file: VirtualSwiper.vue:108 ~ updatePrevView ~ updatePrevView:', to)

  nextTick(() => {
    const prevViewIndex = toIndex(to - 1, playViews.length)
    const prevSongIndex = toIndex(props.currentData - 1, props.data.length)

    playViews[prevViewIndex] = props.data[prevSongIndex]
  })
}

function toIndex(to: number, length: number) {
  if (to < 0) return length - 1

  return to % length
}

defineExpose({
  view: currentView,
  playViews,
  initViews,
  updateNextView,
  updatePrevView
})
</script>
