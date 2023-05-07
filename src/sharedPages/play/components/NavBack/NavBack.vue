<template>
  <view
    class="fixed top-[44px] left-0 z-10 flex items-center rotate-180"
    :style="{ height: statusBarHeight + 'px'}"
    @click="onBack"
  >
    <JIcon custom-class="icon-arrow text-[40rpx] text-white-1 p-5" />
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits(['back'])

const statusBarHeight = useStatusBarHeight()

function onBack() {
  emit('back')

  // #ifndef H5
  uni.navigateBack()
  // #endif
}
</script>
