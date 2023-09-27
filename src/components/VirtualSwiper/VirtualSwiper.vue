
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
  /**
   * 当前显示的view索引（默认显示中间的“View”）
   */
  current?: number
  /**
   * 当前渲染的数据索引
   */
  currentData?: number
  /**
   * 渲染的数据
   */
  data: any[] //* 数据源
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'transition', event: SwiperOnTransitionEvent): void
  (e: 'animationfinish', event: SwiperOnAnimationfinishEvent): void
  (e: 'change', currentView: number, currentData: number): void
  (e: 'previous', currentView: number, currentData: number): void
  (e: 'next', currentView: number, currentData: number): void
}>()

const currentDataIndex = ref(props.currentData || 0) // * 当前数据索引
const currentView = ref(props.current || 1) // * 当前显示的view索引（默认显示中间的“View”）
const playViews = reactive<[any, any, any]>([] as any) //! 只显示3个view，每次动态更新下一个view
const viewLen = 3

watch(
  [() => props.data, () => props.data.length],
  () => { initViews() },
  { immediate: true }
)

watch(() => props.currentData, (dataIndex = 0, oldDataIndex = 0) => {
  currentDataIndex.value = dataIndex

  //* 判断view是否已更新
  if (props.data[dataIndex].id === playViews[currentView.value].id) return

  //* 监听被动切换（非滑动切换），先模拟滑动再更新views
  currentView.value = toIndex(dataIndex > oldDataIndex ? currentView.value + 1 : currentView.value - 1, viewLen)
  initViews()
}, { flush: 'post' })

function onChangeView({ detail: { current: toView, source: isTouch }}: SwiperOnChangeEvent) {
  if (!isTouch) return

  //* 监听主动切换（滑动切换），更新views
  const fromView = currentView.value
  const fromData = currentDataIndex.value

  if (fromView - toView === -1 || fromView - toView === 2) {
    const toData = currentDataIndex.value = toIndex(fromData + 1, props.data.length)
    emit('next', toView, toData)
    emit('change', toView, toData)
    updateNextView(toView, toData)
  } else {
    const toData = currentDataIndex.value = toIndex(fromData - 1, props.data.length)
    emit('previous', toView, toData)
    emit('change', toView, toData)
    updatePrevView(toView, toData)
  }
}

// ! 初始化view
function initViews(view = currentView.value) {
  if (!props.data.length) return

  nextTick(() => {
    const { currentData = 0, data } = props

    playViews[toIndex(view - 1, viewLen)] = data[toIndex(currentData - 1, data.length)]
    playViews[toIndex(view, viewLen)] = data[currentData]
    playViews[toIndex(view + 1, viewLen)] = data[toIndex(currentData + 1, data.length)]
  })
}

function updateNextView(
  toView: number = toIndex(currentView.value + 1, viewLen),
  toData: number = toIndex(currentDataIndex.value + 1, props.data.length)
) {
  if (toView === currentView.value) return

  currentView.value = toView
  currentDataIndex.value = toData

  nextTick(() => {
    const nextViewIndex = toIndex(toView + 1, viewLen)
    const nextSongIndex = toIndex(toData + 1, props.data.length)

    playViews[nextViewIndex] = props.data[nextSongIndex]
  })
}

function updatePrevView(
  toView: number = toIndex(currentView.value - 1, viewLen),
  toData: number = toIndex(currentDataIndex.value - 1, props.data.length)
) {
  if (toView === currentView.value) return

  currentView.value = toView
  currentDataIndex.value = toData

  nextTick(() => {
    const prevViewIndex = toIndex(toView - 1, viewLen)
    const prevSongIndex = toIndex(toData - 1, props.data.length)

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
