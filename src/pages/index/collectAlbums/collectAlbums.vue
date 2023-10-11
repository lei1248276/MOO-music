<template>
  <Navbar
    title="🎵 收藏专辑"
    left-arrow
  />

  <Subtitle
    icon="icon-more"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx]"
    custom-class="!my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="w-[120rpx] h-[60rpx] leading-[60rpx] rounded-full bg-yellow-1 text-black-1 text-[34rpx] text-center">
        {{ cacheStore.collectAlbums.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(album, index) in lazyList"
          :key="album.id"
          class="animate-content"
          :auto-close="false"
        >
          <Album
            :album="album"
            @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
          />

          <template #right>
            <view
              class="bg-red-1 ml-1 w-[120rpx] h-[300rpx] leading-[300rpx] text-white-1 text-[30rpx] text-center"
              @tap="cacheStore.collectAlbums.splice(index, 1)"
            >
              删除
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
const cacheStore = useCacheStore()

const limit = 5
const offset = ref(10)
const lazyList = computed(() => cacheStore.collectAlbums.slice(0, offset.value))

onReachBottom(() => {
  if (lazyList.value.length < cacheStore.collectAlbums.length) offset.value += limit
})
</script>
