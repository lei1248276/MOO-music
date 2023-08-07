<template>
  <view class="flex flex-col justify-between items-center mb-[20rpx]">
    <JImage
      :src="image + '?param=300y300'"
      width="500rpx"
      height="450rpx"
      radius="20rpx"
    />

    <view class="mt-5 w-full flex justify-between items-center">
      <view
        v-if="description"
        class="flex-[0.95] line-clamp-6 text-[42rpx] font-bold text-white-1"
      >
        {{ description }}
      </view>

      <JIcon
        v-if="userStore.profile?.nickname !== playlist.creator.nickname"
        type="icon-heart"
        size="60rpx"
        :custom-class="isCollect ? 'text-red-1 animate-ping !repeat-1' : 'text-grey-1 transition-colors'"
        @click="onCollect"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Playlist } from '@/api/interface/Playlist'

const props = defineProps<{
  playlist: Playlist
  image: string
  description: string | null
}>()

const cacheStore = useCacheStore()
const userStore = useUserStore()

const isCollect = ref(!!cacheStore.collectPlaylist.find(v => v.id === props.playlist.id))

function onCollect() {
  console.log('onCollect')
  if (isCollect.value) {
    const index = cacheStore.collectPlaylist.findIndex(v => v.id === props.playlist.id)
    cacheStore.collectPlaylist.splice(index, 1)
  } else {
    cacheStore.collectPlaylist.unshift(props.playlist)
  }

  isCollect.value = !isCollect.value
}
</script>
