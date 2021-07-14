<script>
  import {mapMutations, mapState} from 'vuex';
  import types from '@/store/mutations-types';

	export default {
		onLaunch: function() {
		  // #ifndef APP-PLUS
      this[types.SET_AUDIO](uni.createInnerAudioContext());
      // #endif
      // #ifdef APP-PLUS
      this[types.SET_AUDIO](uni.getBackgroundAudioManager());
      // #endif
			// console.log(performance.now());

      // 应用初始化时读取最近播放音乐和缓存并设置当前播放歌曲
      this[types.SET_INITIALIZE]();

      this.getAudio.onCanplay(() => {
        // console.log(`canplay: ${this.getAudio.paused}`);
        this.getAudio.play();
        // console.log(this.getAudio.duration);
      })

      this.getAudio.onTimeUpdate(() => {
        this[types.SET_CURRENT_TIME](this.getAudio.currentTime);
      })

      this.getAudio.onPlay(() => {
        // console.log(`play: `);
        this[types.SET_SWITCH](true);
      })

      this.getAudio.onPause(() => {
        // console.log(`pause: `);
        this[types.SET_SWITCH](false);
      })

      this.getAudio.onStop(() => {
        console.log(`stop: `);
      })

      this.getAudio.onEnded(() => {
        console.log(`ended: `);
        const index = this.getShowPageIndex;

        if (index < 2) this[types.SET_SHOW_PAGE_INDEX](index + 1);
        else if (index === 2) this[types.SET_SHOW_PAGE_INDEX](0);
      })

			this.getAudio.onWaiting(() => {
				console.log('waiting');
			})

      this.getAudio.onError(() => {
        uni.showToast({
          title: '歌曲链接失效，请换一首！',
          icon: 'loading',
        })
      })
		},
    computed: {
      ...mapState({
        getAudio: 'audio',
        getIsPlay: 'isPlay',
        getShowPageIndex: 'showPageIndex'
      })
    },
    methods: {
      ...mapMutations([
          types.SET_INITIALIZE,
          types.SET_AUDIO,
          types.SET_SWITCH,
          types.SET_CURRENT_TIME,
          types.SET_SHOW_PAGE_INDEX
      ])
    }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url("./static/iconfont/iconfont.css");
</style>
