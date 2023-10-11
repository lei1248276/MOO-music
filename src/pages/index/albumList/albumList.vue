<template>
  <Navbar
    title="🎵 专辑列表"
    left-arrow
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="animate-enter-content box-border overflow-x-hidden px-[28rpx] after:block after:pb-[var(--save-bottom)]">
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
          @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
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

async function fetchAlbumList() {
  const { albums, total: _total } = await getAlbumList('ALL', albumList.length, limit)
  console.log('🚀 ~ file: albumList.vue:60 ~ fetchAlbumList ~ albums:', albums, _total)
  albumList.push(...albums)
  total = _total
}
</script>
