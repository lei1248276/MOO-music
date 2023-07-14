<template>
  <Navbar
    title="🎵 专辑列表"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
    <!-- #endif -->
    <view class="animate-enter-content box-border overflow-x-hidden px-[28rpx] after:block after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]">
      <view
        v-for="album in albumList"
        :key="album.id"
        class="animate-content"
      >
        <text class="inline-block text-grey-1 text-[30rpx] font-bold mb-2">
          更新于  {{ parseTime(album.publishTime, '{y}-{m}-{d}') }}
        </text>
        <Album
          :album="album"
          @click="toAlbum(album.id)"
        />
      </view>
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import type { Album } from '@/api/interface/AlbumList'
import { getAlbumList } from '@/api/albumList'
import { parseTime } from '@/utils/util'

// #ifdef H5
const isShowPage = ref(true)
// #endif

let total = 0
const limit = 20
const albumList = shallowReactive<Album[]>([])

fetchAlbumList()

onReachBottom(() => {
  albumList.length !== total && fetchAlbumList()
})

function toAlbum(id: number) {
  uni.navigateTo({
    url: `/sharedPages/album/album?id=${id}`,
    fail(err) { console.error(err) }
  })
}

async function fetchAlbumList() {
  const { albums, total: _total } = await getAlbumList('ALL', albumList.length, limit)
  console.log('🚀 ~ file: albumList.vue:60 ~ fetchAlbumList ~ albums:', albums, _total)
  albumList.push(...albums)
  total = _total
}
</script>
