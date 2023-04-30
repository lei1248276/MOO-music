<template>
  <uni-nav-bar
    v-bind="$attrs"
    class="font-bold"
    title="MOO"
    :left-icon="$props.leftArrow ? 'left' : undefined"
    background-color="#1a191b"
    color="#fffeff"
    :border="false"
    fixed
  />
</template>

<script setup lang="ts">
import type { UniNavBarProps } from '@uni-helper/uni-ui-types'
interface NavBarProps extends UniNavBarProps {
  clickLeft?:() => void
  clickRight?: () => void
  leftArrow?: boolean
}

defineProps<NavBarProps>()
</script>
