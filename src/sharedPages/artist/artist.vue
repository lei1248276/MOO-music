<template>
  <Navbar
    :title="'🎵 ' + artist?.name"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition
    class="h-full"
    :show="isShowPage"
  >
    <!-- #endif -->
    <template v-if="artist">
      <JImage
        :src="artist.cover + '?param=400y400'"
        width="100%"
        height="550rpx"
        mode="aspectFill"
      />

      <ArtistInfo :artist="artist" />
    </template>

    <view class="h-full mt-[40rpx]">
      <view
        class="px-[28rpx] z-50 sticky top-0 left-0 right-0 flex justify-between items-center text-center bg-black-2"
        :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
      >
        <text
          v-for="(item, index) in ['热门歌曲', '热门专辑']"
          :key="item"
          class="flex-1 py-2 text-grey-1"
          :class="{'text-white-1 [border-bottom:1px_solid] font-bold': currentPage === index}"
          @tap="currentPage = index"
        >
          {{ item }}
        </text>
      </view>

      <swiper
        class="h-full"
        :duration="400"
        :current="currentPage"
        @change="({detail: { current}}) => {currentPage = current}"
      >
        <swiper-item skip-hidden-item-layout>
          <scroll-view
            class="h-full overscroll-none"
            :scroll-y="isScroll"
            :upper-threshold="0"
            @scrolltoupper="isScroll = false"
            @scrolltolower="artistSongsRef?.loadMore()"
          >
            <ArtistSongs
              v-if="id"
              :id="id"
              ref="artistSongsRef"
              :name="artist?.name || ''"
              :lazy-load="currentPage !== 0"
            />
          </scroll-view>
        </swiper-item>

        <swiper-item skip-hidden-item-layout>
          <scroll-view
            class="h-full overscroll-none"
            :scroll-y="isScroll"
            :upper-threshold="0"
            @scrolltoupper="isScroll = false"
            @scrolltolower="artistAlbumsRef?.loadMore()"
          >
            <ArtistAlbums
              v-if="id"
              :id="id"
              ref="artistAlbumsRef"
              :name="artist?.name || ''"
              :lazy-load="currentPage !== 1"
            />
          </scroll-view>
        </swiper-item>

      <!-- <swiper-item skip-hidden-item-layout>MV</swiper-item> -->
      </swiper>
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import type { Artist } from '@/api/interface/Artist'
import { getArtistDetail } from '@/api/artist'
import ArtistInfo from './components/ArtistInfo/ArtistInfo.vue'
import ArtistSongs from './components/ArtistSongs/ArtistSongs.vue'
import ArtistAlbums from './components/ArtistAlbums/ArtistAlbums.vue'

// #ifdef H5
const isShowPage = ref(true)
// #endif

const id = ref()
const currentPage = ref(0) // * 当前swiper显示索引
const artist = shallowRef<Artist>()

const artistSongsRef = shallowRef<InstanceType<typeof ArtistSongs>>()
const artistAlbumsRef = shallowRef<InstanceType<typeof ArtistAlbums>>()

// ! 用于手动控制局部滚动，scroll-view滚动触顶后会还原（避免页面滚动与局部滚动冲突）
const isScroll = ref(false)
onReachBottom(() => { isScroll.value = true })

onLoad((options) => {
  fetchArtistDetail(id.value = +(options as { id: number }).id)
})

async function fetchArtistDetail(id: number) {
  const { data } = await getArtistDetail(id)
  console.log('🚀 ~ file: artist.vue:29 ~ fetchArtistDetail ~ data:', data)
  artist.value = data.artist
}
</script>
