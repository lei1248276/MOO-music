<template>
  <view class="lyric w-[80%] mid top-[30%] text-center text-[50rpx] text-white-1 whitespace-pre-line">
    <template
      v-for="(item, index) in lyrics"
      :key="index"
    >
      {{ item }}
    </template>
  </view>
</template>

<script setup lang="ts">
import { getLyric } from '@/api/play'

interface Matches {
  time: number
  lyric: string
}

const props = defineProps<{
  songId: number
}>()

const audioStore = useAudioStore()

const lyrics = shallowRef<string[]>([])

let unwatch: Function | null = null
watch(() => props.songId, async() => {
  console.log('🚀 ~ file: Lyric.vue:27 ~ watch ~ props.songId:', props.songId)
  if (unwatch) unwatch()

  const lyricMatches = await fetchLyric()
  if (!lyricMatches) return

  unwatch = watch(() => audioStore.currentTime, (currentTime) => {
    const _lyrics = lyricMatches
      .map((matches) => matchLyric(matches, currentTime))
      .filter(Boolean) as string[]

    _lyrics.length && (lyrics.value = _lyrics)
  })
}, { immediate: true })

function matchLyric(matches: Matches[], currentTime: number) {
  if (!matches[0] || matches[0].time > currentTime) return

  // * 针对播放中进入
  while (matches[1]) {
    if (matches[1].time < currentTime) {
      matches.shift()
      continue
    }
    break
  }

  return matches.shift()!.lyric
}

function transLyric(lyric: string) {
  const regex = /\[(\d{2}:\d{2}\.\d{2,})\]([^[]+)/g

  const matches: Matches[] = []
  let match
  while ((match = regex.exec(lyric)) !== null) {
    const [m, s] = match[1].split(':')
    matches.push({
      time: Number(m) * 60 + Number(s),
      lyric: match[2]
    })
  }

  return matches
}

async function fetchLyric(): Promise<Array<Matches[]> | null> {
  const { lrc, tlyric, needDesc } = await getLyric(props.songId)
  console.log('🚀 ~ file: index.ts:76 ~ fetchLyric ~ tlyric:', tlyric)
  console.log('🚀 ~ file: index.ts:76 ~ fetchLyric ~ lrc:', lrc)

  if (!lrc.lyric) {
    lyrics.value = ['暂无歌词']
    return null
  }

  // * 纯音乐（直接显示描述）
  if (needDesc) {
    lyrics.value = transLyric(lrc.lyric).map(({ lyric }) => lyric)
    return null
  }

  return tlyric && tlyric.lyric
    ? [transLyric(lrc.lyric), transLyric(tlyric.lyric)]
    : [transLyric(lrc.lyric)]
}
</script>
