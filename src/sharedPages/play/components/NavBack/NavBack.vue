<template>
  <view
    class="fixed left-0 z-10 flex items-center rotate-180"
    :style="{ top: 11 + statusBarHeight + 'px'}"
    @tap="onBack"
  >
    <JIcon
      custom-class="icon-arrow text-white-1 p-2"
      size="18px"
    />
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
