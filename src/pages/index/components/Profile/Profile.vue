<template>
  <view class="w-full h-full box-border px-[28rpx] pb-[calc(200rpx_+_var(--save-bottom))] overflow-y-scroll">
    <view class="h-[300rpx] p-[30rpx] rounded-[20rpx] bg-black-1 text-[38rpx] box-border flex flex-col justify-between font-bold">
      <view class="flex items-center space-x-3 text-white-1">
        <template v-if="userStore.profile">
          <JImage
            :src="userStore.profile.avatarUrl"
            width="75rpx"
            height="75rpx"
            radius="50%"
          />
          <text>{{ userStore.profile.nickname }}</text>
        </template>

        <view
          v-else
          class="flex items-center text-base"
          @click="useNavigateTo('/sharedPages/login/login')"
        >
          <JIcon
            type="icon-user"
            custom-class="text-white-1 text-[60rpx] mr-3"
          />
          点击登录
        </view>
      </view>
      <view class="flex justify-between items-center text-grey-1">
        <view class="flex-1">
          <text>关注</text>
          <text>0</text>
        </view>

        <view class="flex-1">
          <text>粉丝</text>
          <text>0</text>
        </view>

        <view
          v-if="userStore.profile?.vipType"
          class="w-[100rpx] h-[50rpx] leading-[50rpx] text-center text-[28rpx] font-bold bg-yellow-1 text-black-1 rounded-full"
        >
          VIP
        </view>
      </view>
    </view>

    <view class="flex flex-wrap justify-around items-center mt-5">
      <Shelf
        v-for="(item, index) in shelf"
        :key="index"
        :description="item.description"
        :count="item.count"
        :icon="item.icon"
        :list="item.list"
        :url="item.url"
      />
    </view>

    <button
      v-if="userStore.profile"
      class="bg-black-1 text-white-1 rounded-full mt-10 mx-10"
      @tap="logout"
    >
      退出登录
    </button>
  </view>
</template>

<script setup lang="ts">
import Shelf from './components/Shelf/Shelf.vue'
import { getUserPlaylist } from '@/api/profile'
import type { Playlist } from '@/api/interface/UserPlaylist'
import toast from '@/utils/toast'

const userStore = useUserStore()
const cacheStore = useCacheStore()

const threeArr = ['', '', '']
const userPlaylist = shallowReactive<Playlist[]>([])

watch(() => userStore.profile, async(profile) => {
  if (profile?.userId) {
    const { playlist } = await getUserPlaylist(profile.userId, 0, 2)
    console.log('🚀 ~ file: Profile.vue:81 ~ getUserPlaylist:', playlist)
    userPlaylist.push(...playlist)
  }
}, { immediate: true })

const shelf = reactive([
  {
    description: '网易云歌单',
    count: computed(() => userStore.subcount?.createdPlaylistCount || 0),
    icon: 'playlist',
    list: computed(() => threeArr.map((v, i) => userPlaylist[i]?.coverImgUrl || v)),
    url: './neteasePlaylist/neteasePlaylist'
  },
  {
    description: '收藏音乐',
    count: computed(() => cacheStore.collectSongs.length),
    icon: 'heart',
    list: computed(() => threeArr.map((v, i) => cacheStore.collectSongs[i]?.al.picUrl || v)),
    url: './collectSongs/collectSongs'
  },
  {
    description: '收藏歌单',
    count: computed(() => cacheStore.collectPlaylist.length),
    icon: 'playlist',
    list: computed(() => threeArr.map((v, i) => cacheStore.collectPlaylist[i]?.coverImgUrl || v)),
    url: './collectPlaylist/collectPlaylist'
  },
  {
    description: '收藏专辑',
    count: computed(() => cacheStore.collectAlbums.length),
    icon: 'album',
    list: computed(() => threeArr.map((v, i) => cacheStore.collectAlbums[i]?.picUrl || v)),
    url: './collectAlbums/collectAlbums'
  },
  {
    description: '收藏歌手',
    count: computed(() => cacheStore.collectArtists.length),
    icon: 'singer',
    list: computed(() => threeArr.map((v, i) => cacheStore.collectArtists[i]?.avatar || v)),
    url: './collectArtists/collectArtists'
  },
  {
    description: '最近播放',
    count: computed(() => cacheStore.historyPlays.length),
    icon: 'time',
    list: computed(() => threeArr.map((v, i) => cacheStore.historyPlays[i]?.al.picUrl || v)),
    url: './historyPlays/historyPlays'
  }
])

async function logout() {
  toast.start()
  await userStore.logout()
  toast.close()
}
</script>
