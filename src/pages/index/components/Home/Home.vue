<template>
  <view class="home h-full px-[28rpx] overflow-y-auto">
    <Carousel />

    <view
      v-for="item in 100"
      :key="item"
    >
      {{ item }}
    </view>
  </view>
</template>

<script setup lang="ts">
import Carousel from './components/Carousel/Carousel.vue'
</script>
