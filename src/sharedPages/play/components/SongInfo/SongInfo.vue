<template>
  <view class="w-[80%] absolute left-[50%] bottom-[18%] translate-x-[-50%] translate-y-[-10%]">
    <button
      v-for="tag in tags"
      :key="tag"
      size="mini"
      class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx]"
      @tap.stop="useNavigateTo(`/sharedPages/searchSongs/searchSongs?keyword=${tag}`)"
    >
      #{{ tag }}
    </button>

    <view class="flex flex-col justify-between mt-[20rpx] text-white-1 font-bold">
      <view class="flex justify-between items-center mb-5">
        <view class="flex-1 truncate text-[48rpx] mr-[20rpx]">{{ name }}</view>

        <view @tap.stop="onCollect">
          <JIcon
            type="icon-heart"
            size="60rpx"
            :custom-class="isCollect ? 'text-red-1 animate-ping !repeat-1' : 'text-white-1 transition-colors'"
          />
        </view>
      </view>

      <view class="flex justify-between items-center">
        <view class="flex-1 truncate space-x-1 text-[38rpx] mr-[20rpx]">
          <text
            v-for="(item, index) in singers.slice(0, 3)"
            :key="index"
            class="active:text-grey-1"
            @tap.stop="useNavigateTo(`/sharedPages/artist/artist?id=${item.id}`)"
          >
            {{ item.name }}.
          </text>
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
import type { Song } from '@/components/Song/Song.vue'

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
