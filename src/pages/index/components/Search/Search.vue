<template>
  <JSearch
    v-model="search"
    custom-class="mx-[28rpx] mt-0"
    bg-color="#010001"
    color="#fce939"
    radius="30rpx"
  >
    <template #searchIcon>
      <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
    </template>
  </JSearch>
</template>

<script setup lang="ts">
import JSearch from '@/components/JSearch/JSearch.vue'
const search = ref('')
</script>
