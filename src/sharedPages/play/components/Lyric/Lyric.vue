<template>
  <view class="lyric w-[80%] max-h-[50%] mid top-[30%] text-center text-[50rpx] text-white-1 whitespace-pre-line line-clamp-6 [text-shadow:#0AFFD5_1rpx_0_10rpx]">
    {{ genLyric(audioStore.currentTime) }}
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

const lyrics = shallowRef<string>('')
let lyricMatches: Matches[][] | null = null

watch(() => props.songId, async(id) => {
  console.log('🚀 ~ file: Lyric.vue:25 ~ watch ~ id:', id)
  lyricMatches = await fetchLyric()
}, { immediate: true })

watch(() => audioStore.isSeeked, async(is) => {
  if (is) lyricMatches = await fetchLyric()
})

// * 生成歌词
function genLyric(currentTime: number) {
  if (!lyricMatches) return lyrics.value

  // * 生成多个版本的歌词
  const _lyrics = lyricMatches
    .map((matches) => matchLyric(matches, currentTime))
    .filter(Boolean) as string[]

  return _lyrics.length ? (lyrics.value = _lyrics.join('')) : lyrics.value
}

// * 匹配歌词
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

// * 转换歌词
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

async function fetchLyric(): Promise<Matches[][] | null> {
  // * 获取 原歌词 和 翻译歌词
  const { lrc, tlyric, needDesc } = await getLyric(props.songId)
  console.log('🚀 ~ file: index.ts:76 ~ fetchLyric ~ tlyric:', tlyric)
  console.log('🚀 ~ file: index.ts:76 ~ fetchLyric ~ lrc:', lrc)

  if (!lrc.lyric) {
    lyrics.value = '暂无歌词'
    return null
  }

  // * 纯音乐（直接显示描述）
  if (needDesc) {
    lyrics.value = transLyric(lrc.lyric).map(({ lyric }) => lyric).join('')
    return null
  }

  return tlyric && tlyric.lyric
    ? [transLyric(lrc.lyric), transLyric(tlyric.lyric)]
    : [transLyric(lrc.lyric)]
}
</script>
