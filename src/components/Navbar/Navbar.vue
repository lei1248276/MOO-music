<template>
  <uni-nav-bar
    class="font-bold"
    title="MOO"
    background-color="#1a191b"
    color="#fffeff"
    :border="false"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type { UniNavBarProps } from '@uni-helper/uni-ui-types'
interface NavBarProps extends UniNavBarProps {}

defineProps<NavBarProps>()

</script>
