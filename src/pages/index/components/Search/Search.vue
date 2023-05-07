<template>
  <JSearchBar
    v-model="search"
    custom-class="mx-[28rpx]"
    bg-color="#010001"
    color="#fce939"
    radius="30rpx"
  >
    <template #searchIcon>
      <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
    </template>
  </JSearchBar>
</template>

<script setup lang="ts">
const search = ref('')
</script>
