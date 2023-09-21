<template>
  <Navbar
    title="🎵 搜索"
    left-arrow
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
    @cancel="searchResultRef?.clear(); isOpen = false; popupRef?.close?.()"
    @clear="searchResultRef?.clear()"
    @confirm="onConfirm"
  >
    <template #searchIcon>
      <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
    </template>
  </JSearch>

  <!-- #ifdef H5 -->
  <H5BackTransition
    :ref="(el: any) => el?.open()"
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
      v-model:suggests="suggests"
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

const search = ref('')
const suggests = shallowRef<Suggests[]>([])
const isOpen = ref(false)
const popupRef = shallowRef<UniPopupInstance>()
const searchResultRef = shallowRef<InstanceType<typeof SearchResult>>()

onMounted(() => {
  // @ts-ignore
  popupRef.value && popupRef.value.closeMask() // * 强行关闭popup的mask
})

const abortTask: UniApp.RequestTask[] = [] // ! 收集“RequestTask”用于在函数外也能控制请求“abort”
watch(search, async(val, oldVal) => {
  try {
    if (val.length && val.length > oldVal.length && val.trim() !== oldVal.trim()) {
      const { result: { allMatch }} = await getSearchSuggest(val, {
        getTask(task) {
          // * 如果发起下一个请求，abort之前的
          abortTask.pop()?.abort()
          abortTask.push(task)
        }
      })

      console.log('🚀 ~ file: Search.vue:102 ~ fetchSearchSuggest ~ allMatch:', allMatch)
      if (allMatch) suggests.value = allMatch
    }
  } catch (error: any) {
    console.error(error.errMsg)
  }
})

function onSearch(keyword: string) {
  if (!isOpen.value) {
    isOpen.value = true
    popupRef.value?.open?.()
  }
  nextTick(() => { searchResultRef.value?.onSelect(keyword) })
}

function onConfirm(keywords: string) {
  if (!keywords) return

  // ! confirm以后“abort”所有剩下的（如果有的话）“suggests”请求
  abortTask.forEach(task => { task.abort() })
  onSearch(keywords)
}
</script>
