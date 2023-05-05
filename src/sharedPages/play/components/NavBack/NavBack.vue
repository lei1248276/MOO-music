<template>
  <view
    class="fixed top-[44px] left-0 z-10 flex items-center"
    :style="{ height: statusBarHeight + 'px'}"
  >
    <JIcon
      custom-class="icon-arrow text-[40rpx] text-white-1 rotate-180 p-5"
      @click="$emit('back')"
    />
  </view>
</template>

<script setup lang="ts">
defineEmits(['back'])

const statusBarHeight = ref(0)

uni.getSystemInfo({
  success({ statusBarHeight: height }) {
    height && (statusBarHeight.value = height)
  }
})
</script>
