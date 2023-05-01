<template>
  <view
    class="my-[20rpx] py-[20rpx] text-[34rpx] font-bold text-white-1 flex justify-between items-center"
    :class="customClass"
    :hover-class="clickable ? 'bg-grey-1/10' : ''"
    hover-stay-time="50"
    @click="onSubtitle"
  >
    <slot name="title">
      <text class="title">
        {{ title }}
      </text>
    </slot>

    <slot name="icon">
      <uni-icons
        custom-prefix="iconfont"
        :type="icon"
        class="!text-grey-1"
        :style="{ fontSize: iconSize + ' !important' }"
      />
    </slot>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  icon?: `icon-${string}`
  iconSize?: string
  url?: string
  clickable?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: 'icon-arrow',
  iconSize: '40rpx',
  url: '',
  clickable: false,
  customClass: ''
})
const emit = defineEmits(['title'])

function onSubtitle() {
  emit('title')

  if (!props.url) return

  uni.navigateTo({ url: props.url, fail(err) { console.error(err) } })
}
</script>
