<template>
  <Subtitle
    title="MOO Tag_探索标签"
    clickable
    icon="icon-fresh"
  />

  <button
    v-for="tag in tags"
    :key="tag"
    size="mini"
    class="font-bold bg-yellow-1 text-black-1 rounded-full mr-[20rpx] mb-[20rpx]"
    @tap="toSearchSongs(tag)"
  >
    #{{ tag }}
  </button>
</template>

<script setup lang="ts">
const tags = ['流行音乐奖', 'Contemporary R&B', '朋友圈', '新城劲爆颁奖礼',
  '千禧曼波', '新城国语力颁奖礼', '太能说了', 'New Wave', '活下去']

function toSearchSongs(tag: string) {
  uni.navigateTo({
    url: `/sharedPages/searchSongs/searchSongs?keyword=${tag}`,
    fail: (err) => { console.error(err) }
  })
}
</script>
