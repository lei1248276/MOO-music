<template>
  <Navbar
    title="歌单列表"
    left-arrow
    @click-left-icon="isShowPage = false"
  />

  <template v-if="songlist.length">
    <!-- ! BUG：避免'uni-transition'内部插槽重新渲染，'uni-transition'的状态会重置（https://github.com/dcloudio/uni-app/issues/3412） -->
    <!-- #ifdef H5 -->
    <uni-transition
      :mode-class="['slide-right']"
      :show="isShowPage"
      @change="onShowPage"
    >
      <!-- #endif -->
      <Songlist
        :songlist="songlist"
        custom-class="min-h-screen bg-black-2 px-[28rpx] after:block after:content-[''] after:pb-[calc(150rpx_+_env(safe-area-inset-bottom))]"
      />
    <!-- #ifdef H5 -->
    </uni-transition>
  <!-- #endif -->
  </template>

  <PlayController />
</template>

<script setup lang="ts">
import type { UniTransitionOnChangeEvent } from '@uni-helper/uni-ui-types'
import { getSonglist } from '@/api/songlist'
import type { Songlist } from '@/api/interface/Songlist'

const isShowPage = ref(true)
const songlist = shallowReactive<Songlist[]>([])
const limit = 20
let total = 0

fetchSonglist()

function onShowPage({ detail: isShow }: UniTransitionOnChangeEvent) {
  !isShow && uni.navigateBack()
}

onReachBottom(() => {
  songlist.length !== total && fetchSonglist()
})

async function fetchSonglist() {
  const { playlists, total: _total } = await getSonglist(songlist.length, limit)
  console.log('🚀 ~ file: songlist.vue:41 ~ fetchSonglist ~ playlists:', playlists, _total)

  total = _total
  songlist.push(...playlists)
}
</script>
