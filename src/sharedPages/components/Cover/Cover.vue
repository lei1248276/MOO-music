<template>
  <view class="flex flex-col justify-between items-center gap-y-5 mb-[20rpx]">
    <JImage
      :src="image + '?param=300y300'"
      width="500rpx"
      height="450rpx"
      radius="20rpx"
    />

    <view class="w-full flex justify-between items-center">
      <view class="flex-[0.95] line-clamp-6 text-[42rpx] font-bold text-white-1">{{ description }}</view>

      <JIcon
        type="icon-heart"
        :custom-class="isCollect ? 'text-red-1 text-[60rpx]' : 'text-grey-1 text-[60rpx]'"
        @click="onCollect"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  id: number
  image: string
  description: string
}>()

const isCollect = ref(false)

function onCollect() {
  console.log('onCollect')
}
</script>
