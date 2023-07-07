<template>
  <view>
    <swiper
      class="rounded-[14rpx] overflow-hidden"
      :autoplay="autoplay"
      :duration="400"
      :interval="4000"
      circular
      indicator-dots
      indicator-color="#ABA8A8"
      indicator-active-color="#fff"
      @change="({detail: { current } }) => {currentIndex = current}"
    >
      <swiper-item
        v-for="(item, index) in bannerList"
        :key="index"
        skip-hidden-item-layout
        class="relative"
      >
        <JImage
          :src="item.pic || ''"
          :lazy-load="currentIndex !== index"
          width="100%"
          height="100%"
          radius="14rpx"
          @click="toBanner(item)"
        />
        <text
          class="z-10 absolute right-0 bottom-0 px-[8rpx] py-[4rpx] bg-white-1 text-black-1 text-xs rounded-xl"
        >
          {{ item.typeTitle }}
        </text>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import type { Banner } from '@/api/interface/Banner'
import { getBanner, getPlaylist } from '@/api/home'

const audioStore = useAudioStore()

const autoplay = ref(false)
const bannerList = shallowRef<Banner[]>([{} as Banner])
const currentIndex = ref(0)

fetchBanner()

onShow(() => { autoplay.value = true })
onHide(() => { autoplay.value = false })

async function toBanner({ targetType, targetId, song }: Banner) {
  // * 取值意义: 1 单曲, 10 专辑, 1000 歌单
  switch (targetType) {
    case 1: {
      if (song) {
        audioStore.$patch(state => {
          if (state.playlist) state.playlist = undefined
          state.songs = [song]
          audioStore.setCurrentSong(song, 0)
        })

        uni.navigateTo({
          url: `/sharedPages/play/play`,
          fail: (err) => { console.error(err) }
        })
      }
      break
    }
    case 10: {
      uni.navigateTo({
        url: `/sharedPages/album/album?id=${targetId}`,
        fail(err) { console.error(err) }
      })
      break
    }
    case 1000: {
      const { playlist } = await getPlaylist(targetId)

      uni.navigateTo({
        url: `/sharedPages/playlist/playlist?id=${targetId}`,
        success: (res) => { res.eventChannel.emit('acceptPlaylist', playlist) },
        fail: (err) => { console.error(err) }
      })
      break
    }
  }
}

async function fetchBanner() {
  const { banners } = await getBanner()
  bannerList.value = banners.filter(v => v.targetType !== 3000) // * 3000是外链的数字专辑

  console.log('🚀 ~ file: Carousel.vue:40 ~ fetchBanner ~ banners:', banners)
}
</script>
