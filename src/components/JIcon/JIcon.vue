<template>
  <text
    class="iconfont relative after:content-[''] after:absolute after:top-[-10rpx] after:right-[-10rpx] after:bottom-[-10rpx] after:left-[-10rpx]"
    :class="type + ' ' + customClass"
    :style="{ ...(size ? {fontSize: size} : {}), ...(color ? {color: color} : {}) }"
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: string
  size?: string
  color?: string
  customClass?: string
}>(), {
  type: '',
  size: '',
  color: '',
  customClass: ''
})

defineEmits(['click'])
</script>
