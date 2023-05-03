<template>
  <icon
    type=""
    class="iconfont"
    :class="type + ' ' + customClass"
    :style="{ ...(size ? {fontSize: size} : {}), ...(color ? {color: color} : {}) }"
    @click.stop="$emit('click')"
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
