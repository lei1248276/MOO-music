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
        <image
          v-if="src"
          :src="src + '?param=100y100'"
          class="absolute w-[50%] h-full"
          :class="'pic-' + (index + 1)"
        />
        <view
          v-else
          class="absolute w-[50%] h-full bg-grey-1 shadow-[4rpx_0_6rpx_#666]"
          :class="'pic-' + (index + 1)"
        >
          <JIcon
            v-if="index === 0"
            :type="'icon-' + icon"
            custom-class="text-white-1 text-[80rpx] mid"
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

<style scoped lang="scss">
.pic-1 {
  left: 0;
  z-index: 3;
}
.pic-2 {
  height: 90%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.pic-3 {
  height: 90%;
  left: 100%;
  transform: translateX(-100%);
  z-index: 1;
}
</style>
