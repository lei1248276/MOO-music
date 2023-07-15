<template>
  <view class="w-auto h-[140rpx] mt-[50rpx] mx-auto rounded-[60rpx] flex items-center bg-black-1">
    <view class="flex-1 relative flex justify-start h-full">
      <JImage
        v-for="(item, index) in recommendList"
        :key="index"
        :class="index === 0 ? 'left-0' : index === 1 ? 'x-mid z-10 !h-[120%]' : 'right-0'"
        class="absolute bottom-0 w-[180rpx] h-full"
        :src="item.picUrl + '?param=100y100'"
        width="180rpx"
        height="100%"
        radius="8rpx"
        @click="toPlaylist(item)"
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
      <JIcon
        :type="isRun ? 'icon-pause' : 'icon-play'"
        custom-class="text-[80rpx] text-yellow-1"
        @click="onPlay"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Recommend } from '@/api/interface/Recommend'
import { getRecommend } from '@/api/home'
import { getPlaylist } from '@/api/home'
import { shuffle, rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()

let cacheList: Recommend[] = []
const recommendList = shallowRef<Recommend[]>(new Array(3).fill({}))
const isRun = ref(false)

onShow(() => {
  if (!cacheList.length) return

  freshRecommend()
})

fetchRecommend()

async function toPlaylist(item: Recommend) {
  const { playlist } = await getPlaylist(item.id)

  uni.navigateTo({
    url: `/sharedPages/playlist/playlist?id=${item.id}`,
    success: (res) => {
      res.eventChannel.emit('acceptPlaylist', playlist)
    },
    fail: (err) => { console.error(err) }
  })
}

async function onPlay() {
  isRun.value = true

  // * 随机获取推荐歌单中某一个
  const randomIndex = rangeRandom(0, recommendList.value.length - 1)
  const { id } = recommendList.value[randomIndex]
  const { playlist } = await getPlaylist(id)

  audioStore.playlist = playlist
  audioStore.songs = playlist.tracks
  await audioStore.setCurrentSong(playlist.tracks[0], 0)

  isRun.value = false
}

function freshRecommend() {
  recommendList.value = shuffle(cacheList).slice(0, 3)
}

async function fetchRecommend() {
  const { result } = await getRecommend(20)
  console.log('🚀 ~ file: Recommend.vue:77 ~ fetchRecommend ~ result:', result)

  cacheList = result
  freshRecommend()
}

defineExpose({
  fetchRecommend
})
</script>
