<template>
  <view class="home_new_song">
    <uni-nav :title="title" class="newSong_nav" @click.native="toNewSonglist"></uni-nav>
    <uni-song :songs="newSong.slice(0, 4)" :playlistId="playlistId"></uni-song>
  </view>
</template>

<script>
// import types from "@/store/mutations-types"

import UniNav from "@/components/nav/UniNav";
import UniSong from "@/components/song/UniSong";

export default {
  props: {
    newSong: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    playlistId: {
      type: String,
      default: ''
    }
  },
  components: {
    UniNav,
    UniSong
  },
  methods: {
    toNewSonglist() {
      uni.navigateTo({
        url: `/pages/newSonglist/NewSonglist?id=${this.playlistId}`,
        animationType: 'slide-in-right',
        animationDuration: 300,
        success: res => {
          res.eventChannel.emit('acceptNewSonglist', this.newSong);
        }
      });
          // this.$store.commit(types.SET_NEW_SONGLIST, this.newSong);
    }
  }
}
</script>

<style scoped lang="scss">
  .home_new_song{
    width: $container-size;
    margin: 0 auto 50rpx;
    .newSong_nav{
      width: 100%;
    }
  }
</style>