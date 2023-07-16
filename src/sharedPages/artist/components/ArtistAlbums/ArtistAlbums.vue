<template>
  <view class="animate-enter-content mt-[40rpx] mx-[28rpx] after:block after:pb-[var(--save-bottom)]">
    <Subtitle
      clickable
      :url="`/sharedPages/searchAlbums/searchAlbums?keyword=${name}`"
    >
      <template #title>
        <view class="w-[120rpx] h-[60rpx] leading-[60rpx] rounded-full bg-yellow-1 text-black-1 text-[34rpx] text-center">
          {{ cacheList.length }}
        </view>
      </template>
    </Subtitle>

    <template v-if="isLoaded">
      <Album
        v-for="album in albums"
        :key="album.id"
        class="animate-content"
        :album="album"
        @click="useNavigateTo(`/sharedPages/album/album?id=${album.id}`)"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import type { HotAlbum } from '@/api/interface/ArtistAlbums'
import { getArtistAlbums } from '@/api/artist'

const props = defineProps<{
  id: number
  name: string
  lazyLoad: boolean
}>()

const isLoaded = ref(false)
const albums = shallowReactive<HotAlbum[]>([])
const cacheList = shallowRef<HotAlbum[]>([])

// ! lazyLoad 和 isLoaded 都为 false 时才进行请求加载
const unwatch = watch(() => props.lazyLoad, async ok => {
  if (!ok && !isLoaded.value) {
    await fetchArtistAlbums(props.id)
    isLoaded.value = true
    unwatch()
  }
}, { immediate: true })

function loadMore(limit = 8) {
  if (albums.length === cacheList.value.length) return

  albums.push(...cacheList.value.slice(albums.length, albums.length + limit))
}

async function fetchArtistAlbums(id: number) {
  const { hotAlbums } = await getArtistAlbums(id)
  console.log('🚀 ~ file: ArtistAlbums.vue:21 ~ fetchArtistAlbums ~ hotAlbums:', hotAlbums)
  cacheList.value = hotAlbums
  loadMore()
}

defineExpose({
  loadMore
})
</script>
