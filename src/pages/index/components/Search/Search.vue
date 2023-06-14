<template>
  <JSearch
    v-model="search"
    custom-class="mt-0"
    bg-color="#010001"
    color="#fce939"
    radius="30rpx"
    readonly
    @click="toSearch"
  >
    <template #searchIcon>
      <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
    </template>
  </JSearch>
</template>

<script setup lang="ts">
const search = ref('')

function toSearch() {
  uni.navigateTo({
    url: '/sharedPages/search/search',
    animationType: 'zoom-fade-out',
    animationDuration: 300,
    fail: (err) => { console.error(err) }
  })
}
</script>
