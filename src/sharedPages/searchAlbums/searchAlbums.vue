<template>
  <Navbar
    :title="'🎵 ' + title"
    left-arrow
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="animate-enter-content box-border overflow-x-hidden px-[28rpx] after:block after:pb-[var(--save-bottom)]">
      <view
        v-for="album in albums"
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

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { SearchAlbumResponse, Album } from '@/api/interface/SearchAlbum'
import { getSearch } from '@/api/search'
import { parseTime } from '@/utils/util'

const title = ref('搜索专辑列表')
const keyword = ref('')
const albums = shallowReactive<Album[]>([])
let albumCount = 0

onLoad((query) => {
  title.value = keyword.value = (query as { keyword: string }).keyword
  console.log('🚀 ~ file: searchSongs.vue:9 ~ onLoad ~ keyword:', keyword.value)
  fetchAlbum(keyword.value)
})

onReachBottom(() => {
  if (albums.length >= albumCount) return

  fetchAlbum(keyword.value)
})

async function fetchAlbum(_keyword: string) {
  const { result } = await getSearch<SearchAlbumResponse>(_keyword, 10, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:109 ~ fetchAlbum ~ albums:', result.albums, result.albumCount)
  albums.push(...result.albums)
  albumCount = result.albumCount
}
</script>
