<template>
  <view class="flex flex-col items-center justify-center">
    <view class="flex justify-center text-blue-600 text-[40rpx]">
      <text class="first-letter:text-[60rpx]">{{ title }}-{{ name }}</text>
    </view>
    <button @click="() => ++count">{{ count }}</button>
  </view>
</template>

<script setup lang="ts">
const title = ref('Hello')
const name = ref('Jaye')
const count = ref(0)
</script>
