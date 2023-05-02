<template>
  <view
    class="w-auto h-[140rpx] mb-5 flex justify-center items-center"
    hover-stay-time="100"
    hover-class="bg-grey-1/10"
    @click="$emit('click')"
  >
    <JImage
      class="mr-5"
      :src="song.al.picUrl"
      width="140rpx"
      height="140rpx"
      radius="12rpx"
      lazy-load
    />

    <view class="flex-1 flex flex-col justify-around h-full">
      <text class="w-[420rpx] text-[38rpx] font-bold truncate text-white-1">{{ song.name }}</text>
      <text class="w-[420rpx] text-[32rpx] truncate text-grey-1">
        <template
          v-for="item in song.ar"
          :key="item.name"
        >
          {{ item.name }}.
        </template>
      </text>
    </view>

    <view
      v-if="isRun"
      class="w-[44rpx] h-[70rpx] flex items-end"
    >
      <i
        v-for="index in 4"
        :key="index"
        class="w-[25%] mr-[2rpx] bg-white-1"
        :class="'wave' + index + (isPlay ? ' run' : ' paused')"
      />
    </view>
    <JIcon
      v-else
      custom-class="icon-more text-grey-1 text-[44rpx]"
    />
  </view>
</template>

<script setup lang="ts">
import type { Song } from '@/api/interface/Song'

defineProps<{
  song: Song
  isRun: boolean
  isPlay: boolean
}>()
defineEmits(['click'])
</script>

<style scoped lang="scss">
@for $i from 1 through 4 {
  .wave#{$i} {
    animation: sequence#{$i} 1s ease-in-out infinite;
    animation-delay: #{0.2 * ($i)}s;
    will-change: "height";
  }
}

@for $i from 1 through 4 {
  @keyframes sequence#{$i} {
    0% {
      height: 10%;
    }
    50% {
      height: 80%;
    }
    100% {
      height: 0%;
    }
  }
}

.run {
  animation-play-state: running;
}
.paused {
  animation-play-state: paused;
}
</style>
