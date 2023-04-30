<template>
  <view class="w-auto h-[140rpx] mt-[50rpx] mx-auto rounded-[60rpx] flex items-center bg-black-1">
    <view class="flex-1 relative flex justify-start h-full">
      <Image
        v-for="(item, index) in recommendList"
        :key="item.id"
        :class="`absolute bottom-0 img-${index + 1}`"
        :src="recommendList[index].picUrl"
        width="180rpx"
        :height="index === 1 ? '120%' : '100%'"
        radius="8rpx"
        passive
      />
    </view>

    <view class="text-yellow-1 flex-1 flex justify-evenly items-center mr-[10rpx]">
      <view>
        <view class="text-white-1 text-[38rpx] font-bold">
          MOO Radio
        </view>
        <text class="text-grey-1 text-[30rpx] tracking-[8rpx]">
          个性好歌推荐
        </text>
      </view>
      <uni-icons
        custom-prefix="iconfont"
        type="icon-play"
        class="!text-[80rpx] !text-yellow-1"
      />
      <!-- <icon
        class="text-yellow-1 iconfont {{ isPlay ? 'icon-pause' : 'icon-play' }}"
        style="font-size: 80rpx"
        bind:tap="onPlay"
      /> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Recommend } from '@/api/interface/Recommend'
import { getRecommend } from '@/api/home'
import { shuffle } from '@/utils/util'

const recommendList = shallowRef<Recommend[]>([])

fetchRecommend()

async function fetchRecommend() {
  const { result } = await getRecommend(10)

  recommendList.value = shuffle(result).slice(0, 3)
}
</script>

<style scoped lang="scss">
.img-1 {
  left: 0%;
}
.img-2 {
  left: 20%;
  z-index: 10;
}
.img-3 {
  left: 40%;
}
</style>
