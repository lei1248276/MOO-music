<template>
  <view v-if="cacheStore.historySearch.length">
    <view class="my-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1">历史搜索</view>
    <button
      v-for="name in cacheStore.historySearch"
      :key="name"
      size="mini"
      class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx] mb-[20rpx]"
      @tap="$emit('select', name)"
    >
      #{{ name }}
    </button>
  </view>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'select', name: string): void
}>()

const cacheStore = useCacheStore()

watch(cacheStore.historySearch, (list) => {
  console.log('🚀 ~ file: SearchHistory.vue:19 ~ watch ~ list:', list)
  uni.setStorage({
    key: 'historySearch',
    data: list,
    fail(err) { console.error(err) }
  })
})
</script>
