<template>
  <view class="min-h-screen bg-black-2">
    <Navbar />

    <NavTitle
      :pages="['home', 'profile']"
      current-page="home"
    />
  </view>
</template>

<script setup lang="ts">
import NavTitle from '../components/NavTitle.vue'

</script>
