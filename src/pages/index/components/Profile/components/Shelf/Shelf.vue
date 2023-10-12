<template>
  <view
    class="w-[330rpx] h-[220rpx] relative"
    @click="toNavigate"
  >
    <view class="relative flex items-end w-[88%] h-[60%] mx-auto">
      <template
        v-for="(src, index) in list"
        :key="index"
      >
        <JImage
          v-if="src"
          :src="src + '?param=100y100'"
          class="!absolute !w-[50%] h-full"
          :class="{
            'left-0 z-[3]': index === 0,
            'h-[90%] left-1/2 -translate-x-1/2 z-[2]': index === 1,
            'h-[90%] left-full -translate-x-full z-[1]': index === 2
          }"
          width="100%"
          height="100%"
          lazy-load
        />
        <view
          v-else
          class="absolute w-[50%] h-full bg-grey-1 shadow-[4rpx_0_6rpx_#666]"
          :class="{
            'left-0 z-[3]': index === 0,
            'h-[90%] left-1/2 -translate-x-1/2 z-[2]': index === 1,
            'h-[90%] left-full -translate-x-full z-[1]': index === 2
          }"
        >
          <JIcon
            v-if="index === 0"
            :type="'icon-' + icon"
            class="text-white-1 text-[80rpx] mid"
          />
        </view>
      </template>
    </view>

    <view class="w-full rounded-[20rpx] py-[12rpx] px-[20rpx] box-border bg-black-1 flex justify-between items-center font-bold">
      <text class="text-white-1">{{ description }}</text>
      <text class="text-grey-1">{{ count }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface ShelfProps {
  description: string
  count: number
  icon: string
  list: string[]
  url: string
}

const props = defineProps<ShelfProps>()
const emit = defineEmits(['click'])

function toNavigate() {
  emit('click')
  if (!props.url) return

  uni.navigateTo({
    url: props.url,
    fail: err => {
      console.error(err)
    }
  })
}
</script>
