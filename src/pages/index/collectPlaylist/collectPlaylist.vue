<template>
  <Navbar
    title="🎵 收藏歌单"
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
        {{ cacheStore.collectPlaylist.length }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <uni-swipe-action class="animate-enter-content">
        <uni-swipe-action-item
          v-for="(playlist, index) in lazyList"
          :key="playlist.id"
          class="animate-content"
          :auto-close="false"
        >
          <view
            class="flex items-center h-[200rpx] mb-5"
            @click="useNavigateTo(`/sharedPages/playlist/playlist?id=${playlist.id}`)"
          >
            <JImage
              :src="playlist.coverImgUrl + '?param=200y200'"
              width="200rpx"
              height="200rpx"
              radius="16rpx"
              lazy-load
            />

            <view class="ml-5 h-full flex flex-col justify-evenly text-bold">
              <view class="w-[450rpx] line-clamp-2 text-[36rpx] text-white-1">
                {{ playlist.name }}
              </view>

              <view class="w-[450rpx] text-[34rpx] text-grey-1">
                {{ playlist.creator.nickname }}
              </view>
            </view>
          </view>

          <template #right>
            <view
              class="bg-red-1 ml-1 w-[120rpx] h-[200rpx] leading-[200rpx] text-white-1 text-[30rpx] text-center"
              @tap="cacheStore.collectPlaylist.splice(index, 1)"
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

const limit = 8
const offset = ref(10)
const lazyList = computed(() => cacheStore.collectPlaylist.slice(0, offset.value))

onReachBottom(() => {
  if (lazyList.value.length < cacheStore.collectPlaylist.length) offset.value += limit
})
</script>
