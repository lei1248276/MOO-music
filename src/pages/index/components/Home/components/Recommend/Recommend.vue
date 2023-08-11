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
        @click="useNavigateTo(`/sharedPages/playlist/playlist?id=${item.id}`)"
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
import type { RecommendSongs } from '@/api/interface/RecommendSongs'
import { getRecommend, getPersonalRecommend, getRecommendSongs } from '@/api/home'
import { getPlaylist } from '@/api/home'
import { shuffle, rangeRandom } from '@/utils/util'

const audioStore = useAudioStore()
const userStore = useUserStore()

let cacheList: Recommend[] = []
const recommendList = shallowRef<Recommend[]>(new Array(3).fill({}))
const recommendSongs = shallowRef<RecommendSongs[]>()

watch(() => userStore.profile, (profile) => {
  if (profile) {
    fetchRecommend(true)
    fetchRecommendSongs()
  } else {
    fetchRecommend(false)
    recommendSongs.value = undefined
  }
}, { immediate: true })

// * 每过2分钟就更新一次
const timeout = 120 * 1000
let tick = Date.now()
let timer: number | undefined
onShow(() => {
  timer = setInterval(() => {
    freshRecommend()
    tick = Date.now()
  }, timeout)

  if (cacheList.length && Date.now() - tick > timeout) {
    freshRecommend()
    tick = Date.now()
  }
})
onHide(() => { clearInterval(timer) })

const isRun = ref(false)
async function onPlay() {
  isRun.value = true

  if (recommendSongs.value) {
    audioStore.playlist = undefined
    audioStore.songs = recommendSongs.value
    await audioStore.setCurrentSong(recommendSongs.value[0], 0)
  } else {
    // * 随机获取推荐歌单中某一个
    const randomIndex = rangeRandom(0, recommendList.value.length - 1)
    const { id } = recommendList.value[randomIndex]
    const { playlist } = await getPlaylist(id)

    audioStore.playlist = playlist
    audioStore.songs = playlist.tracks
    await audioStore.setCurrentSong(playlist.tracks[0], 0)
  }

  isRun.value = false
}

function freshRecommend() {
  recommendList.value = shuffle(cacheList).slice(0, 3)
}

async function fetchRecommend(isLogin: boolean) {
  const data = isLogin ? await getPersonalRecommend() : await getRecommend(20)
  console.log('🚀 ~ file: Recommend.vue:77 ~ fetchRecommend ~ data:', data)

  cacheList = data.result || data.recommend!
  freshRecommend()
}

async function fetchRecommendSongs() {
  const { data: { dailySongs }} = await getRecommendSongs()
  console.log('🚀 ~ file: Recommend.vue:98 ~ fetchRecommendSongs ~ dailySongs:', dailySongs)
  recommendSongs.value = dailySongs
}

defineExpose({
  fetchRecommend
})
</script>
