<template>
  <view class="relative">
    <uni-easyinput
      v-model="search"
      class="rounded-[30rpx] overflow-hidden indent-[54rpx]"
      type="text"
      confirm-type="search"
      :clearable="false"
      :input-border="false"
      :styles="{ backgroundColor: '#010001', color: '#fce939', disableColor: '#eee', borderColor: 'transparent' }"
    />
    <uni-icons
      custom-prefix="iconfont"
      type="icon-search"
      class="!text-[60rpx] !text-yellow-1 absolute top-[50%] translate-y-[-50%] ml-1"
    />
  </view>
</template>

<script setup lang="ts">
const search = ref('')
</script>
