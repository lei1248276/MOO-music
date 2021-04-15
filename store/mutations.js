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

    if (playRecord.length > 0) {
      this.commit(types.SET_CURRENT_SONG, playRecord[curSongIndex]);
      this.commit(types.SET_CURRENT_PLAY_INDEX, curSongIndex);
      this.commit(types.SET_RESET_PAGE_INDEX, curSongIndex);
    }
  },

  // 设置是否初始化
  [types.SET_IS_INIT](state) {
    state.isInit = true;
  },

  // 设置audio
  [types.SET_AUDIO](state, payload) {
  state.audio = payload;
  },

  // 设置播放开关
  [types.SET_SWITCH](state, payload) {
    state.isPlay = payload;
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

  /*// 设置当前歌曲时长
  [types.SET_DURATION](state, payload) {
    state.duration = payload;
  },*/


  // 设置当前歌曲播放时间
  [types.SET_CURRENT_TIME](state, payload) {
    state.currentTime = payload;
  },

  // 设置当前播放歌曲
  [types.SET_CURRENT_SONG](state, payload) {
    state.currentSong = payload;
    this.commit(types.SET_CURRENT_LYRIC, payload.lyric);
  },

  // 设置当前歌曲歌词
  [types.SET_CURRENT_LYRIC]({currentLyric: lyric}, payload) {
    if (payload) {
      let time, t, m;
      time = payload.match(/\d*:\d*\.\d*/g);
      lyric.lrcContentMap = payload.split(/\[.*\]/g);
      lyric.lrcTimeMap = time.map(v => {
        t = v.split(':');
        m = t[0] * 60;
        return m + Number(t[1]);
      });
    }
  },

  // 设置播放页面当前index
  [types.SET_CURRENT_PLAY_INDEX](state, payload) {
    state.currentPlayIndex = payload;
  },

  // 当前playPage页面显示窗口index（保证所有playPage页面显示一致）
  [types.SET_SHOW_PAGE_INDEX](state, payload) {
    state.showPageIndex = payload;
  },

  // 设置当前播放页面顶部窗口歌曲index
  [types.SET_TOP_PAGE_INDEX](state, payload) {
    state.topPageIndex = payload;
  },

  // 设置当前播放页面中间窗口歌曲index
  [types.SET_MIDDLE_PAGE_INDEX](state, payload) {
    state.middlePageIndex = payload;
  },

  // 设置当前播放页面底部窗口歌曲index
  [types.SET_BOTTOM_PAGE_INDEX](state, payload) {
    state.bottomPageIndex = payload;
  },

  // 设置重置pageIndex
  [types.SET_RESET_PAGE_INDEX](state, payload) {
    const last = state.currentPlayQueue.length - 1;
    // 特殊情况（播放列表歌曲少于两首时）
    if (last <= 2) {
      state.showPageIndex = payload;
      return;
    }

    state.showPageIndex = 1;
    state.topPageIndex = payload === 0 ? last : payload - 1;
    state.middlePageIndex = payload;
    state.bottomPageIndex = payload === last ? 0 : payload + 1;
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