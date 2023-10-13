<template>
  <view :class="{'pb-[var(--save-bottom)]': saveArea}">
    <slot :list="lazyList" />

    <scroll-view
      class="h-full"
      scroll-y
      enable-passive
      scroll-anchoring
      scroll-with-animation
      :scroll-into-view="audioStore.associationSong ? undefined : '_' + audioStore.songs[audioStore.currentSongIndex]?.id"
      :lower-threshold="500"
      @scrolltolower="onScrollToLower"
    >
      <template v-if="audioStore.associationSong">
        <view class="flex justify-center items-center">
          <JImage
            class="mr-5"
            :src="audioStore.associationSong.al.picUrl + '?param=100y100'"
            width="140rpx"
            height="140rpx"
            radius="12rpx"
            lazy-load
          />

          <view class="flex-1 flex flex-col justify-around h-full">
            <text class="w-[420rpx] text-[38rpx] font-bold truncate text-white-1">{{ audioStore.associationSong.name }}</text>
            <view class="w-[420rpx] h-[40rpx] space-x-1 text-[28rpx] truncate text-grey-1">
              <text>{{ audioStore.associationSong.ar.reduce((acc, cur) => (acc += cur.name + '.'), '') }}</text>
            </view>
          </view>
        </view>

        <view class="text-lg text-white-1 font-bold text-center [border-bottom:1px_dashed] mb-5">歌曲联想</view>
      </template>

      <Song
        v-for="item in lazyList"
        :id="'_' + item.id"
        :key="item.id"
        :song="item"
        :is-play="audioStore.currentSongInfo?.song.id === item.id && audioStore.isPlay"
        :is-run="audioStore.currentSongInfo?.song.id === item.id"
        :cannot-play="audioStore.currentSongInfo?.song.id === item.id && !audioStore.currentSongInfo?.urlInfo.url"
        @click="onSong(item.id)"
      />

      <view
        v-if="saveArea"
        class="w-full h-[var(--save-bottom)]"
      />
    </scroll-view>
  </view>
</template>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>
// #endif

<script setup lang="ts">
defineProps<{ saveArea?: boolean }>()
const emit = defineEmits<{ (e: 'change'): void }>()

const audioStore = useAudioStore()

// * 根据滚动方向来动态改变对应的指针‘offset’
const limit = 10
// ! ios全端向上滚加载更多都会发生偏移，暂时禁用向上滚动加载
const topOffset = ref(audioStore.currentSongIndex < limit ? 0 : audioStore.currentSongIndex - limit)
const bottomOffset = ref(audioStore.currentSongIndex + limit)
const lazyList = computed(() => audioStore.songs.slice(topOffset.value, bottomOffset.value))

//* 歌曲列表变化，重置offset
watch(() => audioStore.songs, () => {
  topOffset.value = audioStore.currentSongIndex < limit ? 0 : audioStore.currentSongIndex - limit
  bottomOffset.value = audioStore.currentSongIndex + limit
})

// * 向上滚加载更多
/* const onScrollToUpper = function onScrollToUpper() {
  const start = topOffset <= limit ? topOffset - topOffset : topOffset - limit
  if (topOffset === start || topOffset <= 0) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToUpper', { topOffset, start })

  topOffset = start
} */

// * 向下滚加载更多
function onScrollToLower() {
  const end = bottomOffset.value + limit
  if (bottomOffset.value === end || bottomOffset.value >= audioStore.songs.length - 1) return
  console.log('🚀 ~ file: PlaylistPopup.vue:94 ~ onScrollToLower', { bottomOffset, end })

  bottomOffset.value = end
}

function onSong(id: number) {
  //* 因为使用了懒加载列表，所以需要搜索当前歌曲在列表中的索引
  const index = audioStore.songs.findIndex(v => v.id === id)
  audioStore.setCurrentSong(audioStore.songs[index], index)
  emit('change')
}
</script>
