<template>
  <Navbar
    :title="'🎵 ' + title"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <!-- #ifdef H5 -->
  <H5BackTransition :show="isShowPage">
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
import type { SearchAlbumResponse, Album } from '@/api/interface/SearchAlbum'
import { getSearch } from '@/api/search'
import { parseTime } from '@/utils/util'

// #ifdef H5
const isShowPage = ref(true)
// #endif

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

function toAlbum(id: number) {
  uni.navigateTo({
    url: `/sharedPages/album/album?id=${id}`,
    fail(err) { console.error(err) }
  })
}

async function fetchAlbum(_keyword: string) {
  const { result } = await getSearch<SearchAlbumResponse>(_keyword, 10, 0, 10)
  console.log('🚀 ~ file: SearchResult.vue:109 ~ fetchAlbum ~ albums:', result.albums, result.albumCount)
  albums.push(...result.albums)
  albumCount = result.albumCount
}
</script>
