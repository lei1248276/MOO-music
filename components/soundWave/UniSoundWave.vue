<template>
  <ul class="uni_sound_wave">
    <li class="wave1" :class="[run ? 'run' : 'paused']"></li>
    <li class="wave2" :class="[run ? 'run' : 'paused']"></li>
    <li class="wave3" :class="[run ? 'run' : 'paused']"></li>
    <li class="wave4" :class="[run ? 'run' : 'paused']"></li>
  </ul>
</template>

<script>
export default {
  props: {
    run: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
  .uni_sound_wave{
    @include wh(60rpx, 60rpx);
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    list-style: none;
    margin: 0;
    padding: 0;
    .wave1{
      width: 15%;
      position: absolute;
      bottom: 0;
      background-color: $font-color-white;
      left: 10%;
      animation: sequence1 1s ease infinite 0s;
    }
    .wave2{
      @extend .wave1;
      left: 30%;
      animation: sequence2 1s ease-in-out infinite 0.2s;
    }
    .wave3{
      @extend .wave1;
      left: 50%;
      animation: sequence3 1s ease-in-out infinite 0.4s;
    }
    .wave4{
      @extend .wave1;
      left: 70%;
      animation: sequence4 1s ease infinite 0s;
    }
    .run{
      animation-play-state: running;
    }
    .paused{
      animation-play-state: paused;
    }
  }

  @keyframes sequence1 {
    0% {
      height: 20%;
    }
    50% {
      height: 60%;
    }
    100% {
      height: 20%;
    }
  }
  @keyframes sequence2 {
    0% {
      height: 10%;
    }
    50% {
      height: 80%;
    }
    100% {
      height: 10%;
    }
  }
  @keyframes sequence3 {
    0% {
      height: 0;
    }
    50% {
      height: 40%;
    }
    100% {
      height: 0;
    }
  }
  @keyframes sequence4 {
    0% {
      height: 10%;
    }
    50% {
      height: 70%;
    }
    100% {
      height: 10%;
    }
  }
</style>