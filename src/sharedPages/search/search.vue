<template>
  <Navbar
    title="🎵 搜索"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <JSearch
    v-model="search"
    custom-class="mt-0 relative z-[999]"
    bg-color="#010001"
    color="#fce939"
    radius="30rpx"
    placeholder="搜索音乐 专辑 歌手 歌单 用户"
    :cancel-button="isOpen"
    @click="isOpen = true; popupRef?.open?.()"
    @cancel="isOpen = false; popupRef?.close?.()"
    @clear="suggests = []; searchResultRef?.clear()"
    @confirm="searchResultRef?.fetchSongs(search); cacheStore.addHistorySearch(search)"
  >
    <template #searchIcon>
      <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
    </template>
  </JSearch>

  <!-- #ifdef H5 -->
  <H5BackTransition
    :show="isShowPage"
    :mode-class="['fade', 'zoom-in']"
  >
    <!-- #endif -->
    <view class="px-[28rpx]">
      <TopArtists @select="onSearch" />

      <TopSearch @select="onSearch" />
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <uni-popup
    ref="popupRef"
    type="center"
    :is-mask-click="false"
  >
    <SearchResult
      ref="searchResultRef"
      :suggests="suggests"
      @vnode-unmounted="suggests = []"
    />
  </uni-popup>

  <PlayController />
</template>

<script setup lang="ts">
import type { UniPopupInstance } from '@uni-helper/uni-ui-types'
import type { Suggests } from '@/api/interface/SearchSuggest'
import TopArtists from './components/TopArtists/TopArtists.vue'
import TopSearch from './components/TopSearch/TopSearch.vue'
import SearchResult from './components/SearchResult/SearchResult.vue'
import { getSearchSuggest } from '@/api/search'

// #ifdef H5
const isShowPage = ref(true)
// #endif

const cacheStore = useCacheStore()

const search = ref('')
const suggests = shallowRef<Suggests[]>([])
const isOpen = ref(false)
const popupRef = shallowRef<UniPopupInstance>()
const searchResultRef = shallowRef<InstanceType<typeof SearchResult>>()

onMounted(() => {
  // @ts-ignore
  popupRef.value && popupRef.value.closeMask() // * 强行关闭popup的mask
})

watch(search, (val, oldVal) => {
  if (val && val.trim() !== oldVal.trim()) {
    fetchSearchSuggest(val)
    searchResultRef.value?.clear()
  }
})

function onSearch(keyword: string) {
  isOpen.value = true
  popupRef.value?.open?.()
  nextTick(() => {
    searchResultRef.value?.fetchSongs(keyword)
    cacheStore.addHistorySearch(keyword)
  })
}

async function fetchSearchSuggest(keywords:string) {
  const { result: { allMatch }} = await getSearchSuggest(keywords)
  console.log('🚀 ~ file: Search.vue:102 ~ fetchSearchSuggest ~ allMatch:', allMatch)
  if (allMatch) suggests.value = allMatch
}
</script>
