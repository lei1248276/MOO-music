<template>
	<view class="home">
    <uni-loading v-if="!isLoaded"></uni-loading>

    <view v-show="isLoaded">
      <!--   search 区域 -->
      <view class="search"
            :class="[isMove ? 'search_moveT' : 'search_moveB']">
        <text class="iconfont icon-search"></text>
        <input type="text"
               confirm-type="search"
               class="search_text"
               hold-keyboard
               auto-blur>
      </view>

      <!--  scroll-content区域  -->
      <scroll-view class="scroll"
                   scroll-y
                   @scroll="onScroll($event)"
                   @touchstart="onTouchstart"
                   @touchmove="onTouchmove($event)"
                   @touchend="onTouchend">

        <!--   swiper 区域  -->
        <swiper class="home_swiper"
                v-if="bannerList.length"
                indicator-dots
                :autoplay="autoplay"
                circular
                duration="200"
                interval="2500"
                indicator-color="#ABA8A8"
                indicator-active-color="#fff">
          <swiper-item class="swiper_item"
                       v-for="( item, index) in bannerList"
                       :key="index">
            <image :src="item.imageUrl + '?parma=400y200'"
                   class="swiper_img"
                   lazy-load
                   @load="onLoaded">
            </image>
          </swiper-item>
        </swiper>

        <!--   recommend 区域   -->
        <home-recommend :recommend="recommend"
                        @load="onLoaded">
        </home-recommend>

        <!--   playlist 区域   -->
        <uni-nav title="MOO Playlist_歌单"
                 @click.native="toPlaylist">
        </uni-nav>
        <uni-playlist v-if="playlists.length"
                      :playlists="playlists.slice(0, 3)"
                      @load="onLoaded">
        </uni-playlist>

        <!--   newSong 区域   -->
        <home-new-song v-if="newSong.length"
                       :newSong="newSong"
                       :playlistId="(recommend[0].id + '')"
                       title="MOO Track_新歌">
        </home-new-song>

        <!--   album 区域   -->
        <uni-nav title="MOO Album_专辑"></uni-nav>
        <home-album v-if="album.length"
                    :album="album">
        </home-album>

        <!--   tag 区域   -->
        <uni-nav title="MOO Tag_探索标签"
                 flag="icon-fresh">
        </uni-nav>
        <uni-tag :tag="tag"
                 class="home_tag">
        </uni-tag>
      </scroll-view>
    </view>
	</view>
</template>

<script>
import {
  getBanner,
  getRecommend,
  getSongs,
  getPlaylist,
  getPlaylistAll,
  getAlbum} from "@/network/index";
import {dividePlaylist, throttle} from "@/util/index";
import types from '@/store/mutations-types';

import HomeRecommend from "./childCpn/recommend/HomeRecommend";
import HomeNewSong from "./childCpn/newSong/HomeNewSong"
import HomeAlbum from "./childCpn/album/HomeAlbum"
import UniPlaylist from "@/components/playlist/UniPlaylist";
import UniNav from "@/components/nav/UniNav";
import UniTag from "@/components/tag/UniTag";

  export default {
		data() {
			return {
			  isLoaded: false,
				bannerList: [],
        recommend: [],
        playlists: [],
        newSong: [],
        album: [],
        isMove: false,
        autoplay: true,
        tag: ['#流行音乐奖', '#Contemporary R&B', '#朋友圈', '#新城劲爆颁奖礼',
          '#千禧曼波', '#新城国语力颁奖礼', '#太能说了', '#New Wave', '#活下去']
			};
		},
    components: {
      UniPlaylist,
      HomeRecommend,
      HomeNewSong,
      HomeAlbum,
      UniNav,
      UniTag
    },
    created() {
		  this.ok = this.bannerList.length + 2;
		  this.loadImg = 0;

      // console.log(`home created: `, performance.now());
      this.getBanner();
		  this.getRecommendAndNewSong();
		  this.getPlaylistAll(0, 15);
		  this.getAlbum();
    },
    methods: {
      onLoaded() {
        this.loadImg++;
        if (this.ok === this.loadImg) {
          this.$nextTick(() => {
            this.isLoaded = true;
          })
        }
      },

		  getBanner() {
        getBanner().then(res => {
          const [err, data] = res;
          this.bannerList = data.data.banners.map(val => ({imageUrl: val.imageUrl}));
        }).catch(err => {
          console.log(err);
        })
      },

      getRecommendAndNewSong() {
		    // 1.获取推荐歌单
        getRecommend().then(res => {
          let [err, data] = res;
          this.recommend = data.data.result.map(val => ({
            id: val.id,
            name: val.name,
            picUrl: val.picUrl
          }));
          return this.recommend[0].id;
        }).then(id => {
          // 2.直接从推荐歌单发出请求获取到歌曲id添加到newSong中
          getPlaylist(id).then(res => {
            let [err, data] = res,
                tracks = data.data.playlist.trackIds,
                ids = tracks[0].id;
            for (let i = 1, len = tracks.length; i < len; i++) {
              ids += `,${tracks[i].id}`;
            }
            // 3.获取所有歌曲
            getSongs(ids).then(res => {
              let [err, data] = res;
              this.newSong = data.data.songs.map(val => ({
                id: val.id,
                picUrl: val.al.picUrl,
                name: val.name,
                singer: val.ar[0].name
              }));
            }).catch(err => {
              console.log(err);
            })

          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
        })
      },

      getPlaylistAll(offset, limit) {
        getPlaylistAll(offset, limit).then(res => {
          const [err, data] = res,
              pl = dividePlaylist(data.data.playlists);
          this.playlists = pl[0];
          this.$store.commit(types.SET_PLAYLISTS, pl);
        }).catch(err => {
          console.log(err);
        })
      },

      getAlbum() {
        getAlbum().then(res => {
          const [err, data] = res;
          this.album = Object.seal(data.data.products);
          // console.log(this.album);
        }).catch(err => {
          console.log(err);
        })
      },

      onScroll: throttle(function (e) {
        let scrollT = e.target.scrollTop;
        this.isMove = this.scrollTop < scrollT;
        this.scrollTop = scrollT;
      }, 150),

      toPlaylist() {
        uni.navigateTo({
          url: '/pages/playlist/Playlist',
          animationType: 'slide-in-right',
          animationDuration: 300,
          /*success: res => {
            res.eventChannel.emit('acceptPlaylists', dividePlaylist(this.playlists));
          }*/
        });
      },

      onAutoplay() {
		    this.autoplay = !this.autoplay;
      },

      onTouchstart(e) {
        this.startX = e.touches[0].clientX;
        this.isMove = false;
      },

      onTouchmove: throttle(function(e) {
        this.isReach = this.startX - e.touches[0].clientX >= 10;
      }, 100),

      onTouchend() {
        if (!this.isMove && this.isReach) {
          this.isMove = true;
          uni.navigateTo({
            url: '/pages/profile/Profile',
            animationType: 'slide-in-right',
            animationDuration: 300,
            success: () => {
              this.isMove = this.isReach = false;
            }
          })
        }
      }
    },
  }
</script>

<style scoped lang="scss">
	.home{
    width: 100%;
    height: 100%;
    position: relative;
		background-color: $bgc-black2;

    .search {
      width: $container-size;
      padding: 1%;
      background-color: $bgc-black1;
      border-radius: 30rpx;
      position: fixed;
      top: 13%;
      left: 3%;
      z-index: 1111;
      transition: all .5s;
      .icon-search{
        font-size: $icon-size;
        color: $icon-color-orange;
      }
      .search_text {
        display: inline-block;
        width: 88%;
        color: $font-color-white;
        caret-color: $icon-color-orange;
        position: relative;
        left: 12rpx;
        z-index: 1000;
      }
    }
    .search_moveT{
      transform: translate3d(0, -70rpx, 0);
      opacity: 0;
    }
    .search_moveB{
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }

		.scroll{
			position: absolute;
			top: 14%;
			left: 0;
			right: 0;
			bottom: 0;

      .home_swiper{
        @include wh($container-size, 300rpx);
        margin: 90rpx auto 50rpx;
        .swiper_item{
          @include wh(100%, 100%);
          border-radius: 14rpx;
          background-color: grey;
          .swiper_img{
            width: 100%;
            height: 100%;
          }
        }
      }

      .home_tag{
        height: 440rpx;
      }
		}
	}
</style>
