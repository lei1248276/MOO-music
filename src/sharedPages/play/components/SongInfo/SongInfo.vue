<template>
  <view class="w-[80%] absolute left-[50%] bottom-[18%] translate-x-[-50%] translate-y-[-10%]">
    <button
      v-for="tag in tags"
      :key="tag"
      size="mini"
      class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx]"
      @tap.stop="toSearchSongs(tag)"
    >
      #{{ tag }}
    </button>

    <view class="flex flex-col justify-between mt-[20rpx] text-white-1 font-bold">
      <view class="flex justify-between items-center mb-5">
        <view class="text-[48rpx] mr-[20rpx]">{{ name }}</view>

        <view @tap.stop="onCollect">
          <JIcon
            type="icon-heart"
            size="60rpx"
            :custom-class="isCollect ? 'text-red-1 animate-ping !repeat-1' : 'text-white-1 transition-colors'"
          />
        </view>
      </view>

      <view class="flex justify-between items-center">
        <view class="flex-1 truncate text-[38rpx] mr-[20rpx]">
          <template
            v-for="(item, index) in singers"
            :key="index"
          >
            {{ item.name }}.
          </template>
        </view>

        <view @tap.stop="$emit('menu')">
          <JIcon custom-class="icon-menu text-[66rpx]" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Playlist } from '@/api/interface/Playlist'
import type { Song } from '@/api/interface/Song'

const props = defineProps<{
  tags: Playlist['tags']
  name: string
  singers: Song['ar']
  song: Song
}>()
defineEmits(['menu'])

const cacheStore = useCacheStore()

const isCollect = ref(!!cacheStore.collectSongs.find(v => v.id === props.song.id))

watch(() => props.name, () => {
  isCollect.value = !!cacheStore.collectSongs.find(v => v.id === props.song.id)
})

function toSearchSongs(tag: string) {
  uni.navigateTo({
    url: `/sharedPages/searchSongs/searchSongs?keyword=${tag}`,
    fail: (err) => { console.error(err) }
  })
}

function onCollect() {
  console.log('onCollect')
  if (isCollect.value) {
    const index = cacheStore.collectSongs.findIndex(v => v.id === props.song.id)
    cacheStore.collectSongs.splice(index, 1)
  } else {
    cacheStore.collectSongs.unshift(props.song)
  }

  isCollect.value = !isCollect.value
}
</script>
