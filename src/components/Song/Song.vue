<template>
  <view>
    <view
      class="active:animate-back w-auto h-[140rpx] mb-5 flex justify-center items-center"
      :class="[customClass, canPlay ? '' : '!opacity-30 pointer-events-none']"
      :hover-stay-time="100"
      hover-class="bg-grey-1/10"
      @tap="$emit('click')"
    >
      <JImage
        class="mr-5"
        :src="song.al.picUrl + '?param=100y100'"
        width="140rpx"
        height="140rpx"
        radius="12rpx"
        lazy-load
      />

      <view class="flex-1 flex flex-col justify-around h-full">
        <text class="w-[420rpx] text-[38rpx] font-bold truncate text-white-1">{{ song.name }}</text>
        <view class="w-[420rpx] h-[40rpx] space-x-1 text-[28rpx] truncate text-grey-1">
          <text
            v-for="item in song.ar"
            :key="item.name"
            class="active:text-white-1"
            @tap.stop="useNavigateTo(`/sharedPages/artist/artist?id=${item.id}`)"
          >
            {{ item.name }}.
          </text>
        </view>
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
        class="icon-more text-grey-1 text-[44rpx]"
      />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup lang="ts">
export interface Song {
  id: number
  name: string
  ar: {
    id: number
    name: string
  }[],
  al: {
    id: number
    name: string
    picUrl: string
    pic: number
  }
}

const props = defineProps<{
  song: Song
  isRun: boolean
  isPlay: boolean
  cannotPlay?: boolean
  customClass?: string
}>()
defineEmits(['click'])

const canPlay = ref(true)

const unwatch = watch(() => props?.cannotPlay, (cannotPlay) => {
  canPlay.value = !cannotPlay
  unwatch()
})
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
