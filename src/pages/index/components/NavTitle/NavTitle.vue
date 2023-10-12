<template>
  <view class="bg-black-2 text-white-1 text-[70rpx] px-[28rpx] pb-[20rpx]">
    <view class="flex justify-between items-center">
      <text>{{ isHome ? 'DISCOVER' : 'PROFILE' }}</text>

      <JIcon
        v-if="!userStore.profile"
        v-show="isHome"
        type="icon-user"
        class="text-white-1 text-[60rpx]"
        @click="useNavigateTo('/sharedPages/login/login')"
      />
      <JImage
        v-else
        v-show="isHome"
        :src="userStore.profile.avatarUrl"
        width="75rpx"
        height="75rpx"
        radius="50%"
      />

      <JIcon
        v-show="!isHome"
        type="icon-setting"
        class="text-white-1 text-[60rpx]"
      />
    </view>

    <view class="flex">
      <view
        v-for="item in pages"
        :key="item"
        :class="currentPage === item ? 'w-[36rpx] !rounded-[20rpx] bg-white-1' : ''"
        class="w-[18rpx] h-[18rpx] bg-grey-1 rounded-[50%] mr-1 transition-[width] duration-500 ease-in-out"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  pages: string[]
  currentPage: string
}>()

const userStore = useUserStore()

const isHome = computed(() => props.currentPage === 'home')
</script>
