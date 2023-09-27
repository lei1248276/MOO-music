<template>
  <VirtualSwiper
    class="w-full h-full"
    :data="newMV"
    vertical
    circular
    skip-hidden-item-layout
    @change="onChange"
  >
    <template #default="{item: mv}: {item: typeof newMV[number]}">
      <video
        id="myVideo"
        :src="mv.id === newMV[currentIndex].id && isShow ? mv.url : ''"
        :poster="mv.cover"
        :direction="90"
        autoplay
        class="w-full h-[500rpx]"
        @touchstart.stop
      />

      <view
        v-if="mv.detail"
        class="p-[20rpx] text-white-1"
      >
        <view class="mb-2 flex items-center space-x-2">
          <JImage
            :src="mv.detail.artists[0].img1v1Url"
            width="100rpx"
            height="100rpx"
            radius="50%"
          />
          <view class="space-x-1 space-y-1">
            <text class="inline-block px-[2rpx] [border:2rpx_solid] !border-red-1 !border-opacity-50 text-red-1 text-[18rpx] align-top rounded-[6rpx]">MV</text>
            <text class="font-bold text-[38rpx]">{{ mv.detail.name }}</text>
            <view class="indent-4 text-left text-[30rpx] text-grey-1">{{ mv.detail.artists[0].name }}</view>
          </view>
        </view>

        <view class="text-[rgba(255,255,255,.7)] text-[28rpx] mb-2">{{ mv.detail.playCount }} 次观看 {{ mv.detail.publishTime }}</view>

        <view class="line-clamp-6">{{ mv.detail.desc }}</view>
      </view>
    </template>
  </VirtualSwiper>
</template>

<script setup lang="ts">
import type { NewMVResponse } from '@/api/interface/NewMV'
import type { MVDetailResponse } from '@/api/interface/MVDetail'
import { getNewMV, getMVDetail, getMVurl } from '@/api/mv'

type NewMv = NewMVResponse['data'][number] & { detail?: MVDetailResponse['data'], url?: string }

const props = defineProps<{
  isShow: boolean
}>()

const audioStore = useAudioStore()

const newMV = reactive<NewMv[]>([])
const currentIndex = ref(0)

watch(() => props.isShow, (is) => {
  if (is && audioStore.currentSongInfo) audioStore.audio.pause()
})

fetchNewMV().then(() => {
  fetchMVDetail(newMV[0].id)
  fetchMVurl(newMV[0].id)
})

function onChange(_: number, current: number) {
  currentIndex.value = current
  !newMV[current].detail && fetchMVDetail(newMV[current].id)
  !newMV[current].url && fetchMVurl(newMV[current].id)
}

async function fetchNewMV() {
  const { data } = await getNewMV()
  console.log('🚀 ~ file: MV.vue:20 ~ fetchNewMV ~ data:', data)
  newMV.push(...data)
}

async function fetchMVDetail(id: number) {
  const { data } = await getMVDetail(id)
  console.log('🚀 ~ file: MV.vue:37 ~ fetchMVDetail ~ data:', data)
  newMV[currentIndex.value].detail = data
}

async function fetchMVurl(id: number) {
  const { data } = await getMVurl(id)
  console.log('🚀 ~ file: MV.vue:78 ~ fetchMVurl ~ data:', data)
  newMV[currentIndex.value].url = data.url
}
</script>
