import Vue from 'vue';
import Vuex from 'vuex';
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

const state = {
  isInit: false,        // 是否初始化
  lock: false,          // 填坑操作
  audio: null,          // 播放器
  isPlay: false,        // 是否开始播放

  playlists: [],        // 全部播放歌单
  newSonglist: [],      // 新歌歌单
  songlistDetails: {},  // 歌单详情信息

  duration: 0,          // 当前歌曲时长
  currentTime: 0,       // 当前歌曲播放时间
  currentSong: null,    // 当前播放歌曲
  currentPlayIndex: 0,  // 当前播放歌曲index
  showPageIndex: 1,     // 当前playPage页面显示窗口index（保证所有playPage页面显示一致）
  topPageIndex: -1,     // 当前播放页面顶部窗口歌曲index
  middlePageIndex: -1,  // 当前播放页面中间窗口歌曲index
  bottomPageIndex: -1,  // 当前播放页面底部窗口歌曲index
  currentPlayQueue: [], // 当前歌曲播放队列

  cacheQueue: new Map(),// 歌曲临时缓存队列
  recentPlaySongs: [],  // 最近播放歌曲
  colSongs: {},         // 收藏的歌曲
  colPlaylists: {},     // 收藏的歌单
};

const store = new Vuex.Store({
  state,
  mutations,
  actions
});

export default store;