<template>
  <view class="my-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1">热门搜索</view>
  <button
    v-for="tag in topSearch"
    :key="tag.first"
    size="mini"
    class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx] mb-[20rpx]"
  >
    #{{ tag.first }}
  </button>
</template>

<script setup lang="ts">
import type { TopSearch } from '@/api/interface/TopSearch'
import { getTopSearch } from '@/api/search'

const topSearch = shallowRef<TopSearch[]>()

fetchTopSearch()
async function fetchTopSearch() {
  const { result: { hots }} = await getTopSearch()
  console.log('🚀 ~ file: Search.vue:84 ~ fetchTopSearch ~ result:', hots)
  topSearch.value = hots
}
</script>
