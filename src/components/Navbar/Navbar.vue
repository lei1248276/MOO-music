<template>
  <uni-nav-bar
    v-bind="$attrs"
    class="font-bold"
    :title="$attrs.title as string || '🎵 MOO'"
    :left-icon="$props.leftArrow ? 'back' : undefined"
    background-color="#1a191b"
    color="#fffeff"
    :border="false"
    fixed
    status-bar
    @clickLeft="onClickLeft"
    @clickRight="onClickRight"
  />
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
import type { UniNavBarProps } from '@uni-helper/uni-ui-types'
interface NavBarProps extends UniNavBarProps {
  leftArrow?: boolean
}

defineProps<NavBarProps>()
const emit = defineEmits(['clickLeftIcon', 'clickRightIcon'])

function onClickLeft() {
  emit('clickLeftIcon')

  uni.navigateBack()
}

function onClickRight() {
  emit('clickRightIcon')
}
</script>
