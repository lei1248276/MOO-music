import types from './mutations-types';

export default {
  // 设置初始化
  [types.SET_INITIALIZE](state) {
    let recentPlaySongs = uni.getStorageSync('recentPlaySongs') || [],
        playRecord = uni.getStorageSync('playRecord') || [],
        curSongIndex = (playRecord.length && recentPlaySongs.length)
            && playRecord.findIndex(value => value.id === recentPlaySongs[0].id);

    state.recentPlaySongs = recentPlaySongs;
    uni.getStorage({
      key: 'colSongs',
      success: res => {
        state.colSongs = res.data;
      }
    });
    uni.getStorage({
      key: 'colPlaylists',
      success: res => {
        state.colPlaylists = res.data;
      }
    });
    state.currentPlayQueue = playRecord;
    state.currentSong = playRecord[curSongIndex];
    state.playPageIndex = curSongIndex;
  },

  // 设置初始化
  /*[types.SET_INITIALIZE](state) {
    let [...RPS] = state.recentPlaySongs = uni.getStorageSync('recentPlaySongs') || [];
    uni.getStorage({
      key: 'colSongs',
      success: res => {state.colSongs = res.data;}
    });
    uni.getStorage({
      key: 'colPlaylists',
      success: res => {state.colPlaylists = res.data;}
    });

    state.currentPlayQueue = RPS.length >= 20 ? RPS.slice(0, 20) : RPS;
    state.currentSong = RPS[0];
  },*/

  // 设置是否初始化
  [types.SET_IS_INIT](state) {
    state.isInit = true;
  },

  // 设置audio
  [types.SET_AUDIO](state, payload) {
  state.audio = payload;
  },

  // 设置当前播放歌曲
  [types.SET_CURRENT_SONG](state, payload) {
    state.currentSong = payload;
  },

  // 设置播放开关
  [types.SET_SWITCH](state, payload) {
    state.isPlay = payload;
  },

  /*// 设置歌曲时长
  [types.SET_DURATION](state, payload) {
    state.duration = payload;
  },*/

  // 设置歌曲当前播放时间
  [types.SET_CURRENT_TIME](state, payload) {
    state.currentTime = payload;
  },

  // 设置播放列表
  [types.SET_PLAYLISTS](state, payload) {
    state.playlists = payload;
  },

  // 设置新歌单
  [types.SET_NEW_SONGLIST](state, payload) {
    state.newSonglist = payload;
  },

  // 设置歌单详情信息
  [types.SET_SONGLIST_DETAILS](state, payload) {
    state.songlistDetails = payload;
  },

  // 设置播放页面当前index
  [types.SET_PLAY_PAGE_INDEX](state, payload) {
    state.playPageIndex = payload;
  },

  // 设置当前播放队列
  [types.SET_CURRENT_PLAY_QUEUE](state, payload) {
    // state.currentPlayQueue.unshift(Object.seal(payload));
    state.currentPlayQueue = payload;
    uni.setStorage({
        key: 'playRecord',
        data: payload
    })
  },

  // 设置缓存队列（临时）
  [types.SET_CACHE_QUEUE](state, payload) {
    state.cacheQueue.set(payload.id, payload);
  },

  // 设置最近播放过的歌曲
  [types.SET_RECENT_PLAY_SONGS](state, payload) {
    let RPS = state.recentPlaySongs, i;
    // 查询最近播放列表中是否存在该歌曲，存在就从新放置到第一项，不存在就添加到第一项
    i = RPS.findIndex(value => value.id === payload.id);
    if (i !== -1) {
      RPS.unshift(...RPS.splice(i, 1));
    } else {
      RPS.unshift(payload)
      RPS.length > 50 && RPS.pop();
    }
    state.recentPlaySongs = RPS;
    /*console.log(state.recentPlaySongs);
    console.log(state.currentPlayQueue);*/
    uni.setStorage({
      key: 'recentPlaySongs',
      data: RPS,
      /*success: res => {
        console.log(uni.getStorageSync('recentPlaySongs'));
      }*/
    })
  },

  // 设置收藏歌曲
  [types.SET_COL_SONGS]({colSongs}, payload) {
    if (Array.isArray(payload)) {
      payload.forEach(id => {
        delete colSongs[id];
      })
    } else {
      let id = payload.id;
      if (colSongs[id] != null) {
        delete colSongs[id];
      } else {
        colSongs[id] = payload;
      }
    }

    uni.setStorage({
      key: 'colSongs',
      data: colSongs
    });
  },

  // 设置收藏歌单
  [types.SET_COL_PLAYLISTS]({colPlaylists}, payload) {
    if (Array.isArray(payload)) {
      payload.forEach(id => {
        delete colPlaylists[id]
      })
    } else {
      let id = payload.id;
      if (colPlaylists[id] != null) {
        delete colPlaylists[id]
      } else {
        colPlaylists[id] = payload;
      }
    }

    uni.setStorage({
      key: 'colPlaylists',
      data: colPlaylists
    })
  }
}