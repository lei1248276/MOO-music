<template>
  <Navbar
    title="🎵 收藏歌手"
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
        {{ cacheStore.collectArtists.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(artist, index) in lazyList"
          :key="artist.id"
          class="animate-content"
          :auto-close="false"
        >
          <Artist
            :artist="artist"
            @click="useNavigateTo(`/sharedPages/artist/artist?id=${artist.id}`)"
          />

          <template #right>
            <view
              class="bg-red-1 ml-1 w-[120rpx] h-[140rpx] leading-[140rpx] text-white-1 text-[30rpx] text-center"
              @tap="cacheStore.collectArtists.splice(index, 1)"
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

const limit = 10
const offset = ref(10)
const lazyList = computed(() => cacheStore.collectArtists.slice(0, offset.value))

onReachBottom(() => {
  if (lazyList.value.length < cacheStore.collectArtists.length) offset.value += limit
})
</script>
