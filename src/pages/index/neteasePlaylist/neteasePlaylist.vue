<template>
  <Navbar
    title="🎵 网易云歌单"
    left-arrow
  />

  <Subtitle
    icon="icon-more"
    class="z-50 fixed left-0 right-0 bg-black-2 px-[28rpx] !my-0"
    :style="{ top: 44 + useStatusBarHeight().value + 'px' }"
  >
    <template #title>
      <view class="w-[120rpx] h-[60rpx] leading-[60rpx] rounded-full bg-yellow-1 text-black-1 text-[34rpx] text-center">
        {{ userStore.subcount?.createdPlaylistCount }}
      </view>
    </template>
  </Subtitle>

  <!-- #ifdef H5 -->
  <H5BackTransition :ref="(el: any) => el?.open()">
    <!-- #endif -->
    <view class="animate-enter-content bg-black-2 px-[28rpx] mt-[106rpx] after:block after:pb-[var(--save-bottom)]">
      <view
        v-for="playlist in userPlaylist"
        :key="playlist.id"
        class="animate-content flex items-center h-[200rpx] mb-5"
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
    </view>
  <!-- #ifdef H5 -->
  </H5BackTransition>
  <!-- #endif -->

  <PlayController />
</template>

<script setup lang="ts">
import { getUserPlaylist } from '@/api/neteasePlaylist'
import type { Playlist } from '@/api/interface/UserPlaylist'

const userStore = useUserStore()

const limit = 8
const userPlaylist = shallowReactive<Playlist[]>([])

fetchUserPlaylist()

onReachBottom(() => {
  if (userPlaylist.length >= userStore.subcount!.createdPlaylistCount) return

  fetchUserPlaylist()
})

async function fetchUserPlaylist() {
  if (!userStore.profile?.userId) return

  const { playlist } = await getUserPlaylist(userStore.profile.userId, userPlaylist.length, limit)
  console.log('🚀 ~ file: Profile.vue:81 ~ watch ~ playlist:', playlist)
  userPlaylist.push(...playlist)
}
</script>
