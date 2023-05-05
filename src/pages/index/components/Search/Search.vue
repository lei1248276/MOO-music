<template>
  <view class="search px-[28rpx] mb-[20rpx]">
    <uni-search-bar
      v-model="search"
      cancel-button="none"
      placeholder=" "
      bg-color="#010001"
      :radius="15"
    >
      <template #searchIcon>
        <JIcon custom-class="icon-search text-[60rpx] text-yellow-1" />
      </template>
    </uni-search-bar>
  </view>
</template>

<script setup lang="ts">
const search = ref('')
</script>

<style lang="scss">
.search{
  .uni-searchbar{
    padding: 0;
    :deep(.uni-searchbar__box .uni-searchbar__box-search-input){
      color: #fce939 !important;
    }
  }
}
</style>
