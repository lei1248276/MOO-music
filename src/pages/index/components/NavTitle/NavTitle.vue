<template>
  <view class="bg-black-2 text-white-1 text-[70rpx] px-[28rpx] pb-[20rpx]">
    <view class="flex justify-between items-center">
      <text>{{ isHome ? 'DISCOVER' : 'PROFILE' }}</text>
      <JIcon
        :type="isHome ? 'icon-user' : 'icon-setting'"
        custom-class="text-white-1 text-[60rpx]"
      />
    </view>

    <view class="flex">
      <view
        v-for="item in pages"
        :key="item"
        :class="currentPage === item ? 'w-[36rpx] !rounded-[20rpx] bg-white-1' : ''"
        class="w-[18rpx] h-[18rpx] bg-grey-1 rounded-[50%] mr-1 transition-[width] duration-500 ease-in-out"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  pages: string[]
  currentPage: string
}>()

const isHome = computed(() => props.currentPage === 'home')
</script>
