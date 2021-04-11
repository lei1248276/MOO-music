import Vue from 'vue';
import Vuex from 'vuex';
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

const state = {
  isInit: false,        // 是否初始化
  lock: false,          // 填坑操作
  audio: null,
  currentSong: null,    // 当前播放歌曲
  isPlay: false,        // 是否开始播放
  duration: 0,          // 歌曲时长
  currentTime: 0,       // 歌曲当前播放时间

  playlists: [],        // 全部播放歌单
  newSonglist: [],      // 新歌歌单
  songlistDetails: {},   // 歌单详情信息
  playPageIndex: 0,     // 播放页面当前坐标

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