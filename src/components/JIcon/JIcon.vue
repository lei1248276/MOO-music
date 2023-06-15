<template>
  <text
    class="iconfont btn-zoom"
    :class="type + ' ' + customClass"
    :style="{ ...(size ? {fontSize: size} : {}), ...(color ? {color: color} : {}) }"
    @tap="$emit('click')"
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
