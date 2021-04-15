export default {
  SET_INITIALIZE: 'setInitialize',                // 设置初始化
  SET_IS_INIT: 'setIsInit',                       // 设置是否初始化
  SET_AUDIO: 'setAudio',                          // 设置audio
  SET_SWITCH: 'setSwitch',                        // 设置播放开关

  SET_PLAYLISTS: 'setPlaylists',                  // 设置播放列表
  SET_NEW_SONGLIST: 'setNewSongList',             // 设置新歌单
  SET_SONGLIST_DETAILS: 'setSonglistDetails',     // 设置歌单详情信息

  SET_DURATION: 'setDuration',                    // 设置当前歌曲时长
  SET_CURRENT_TIME: 'setCurrentTime',             // 设置当前歌曲当前播放时间
  SET_CURRENT_SONG: 'setCurrentSong',             // 设置当前播放歌曲
  SET_CURRENT_LYRIC: 'setCurrentLyric',           // 设置当前歌曲歌词
  SET_CURRENT_PLAY_INDEX: 'setCurrentPlayIndex',  // 设置当前播放歌曲index
  SET_SHOW_PAGE_INDEX: 'setShowPageIndex',        // 当前playPage页面显示窗口index
  SET_TOP_PAGE_INDEX: 'setTopPageIndex',          // 设置当前播放页面顶部窗口歌曲index
  SET_MIDDLE_PAGE_INDEX: 'setMidPageIndex',       // 设置当前播放页面中间窗口歌曲index
  SET_BOTTOM_PAGE_INDEX: 'setBottomPageIndex',    // 设置当前播放页面底部窗口歌曲index
  SET_RESET_PAGE_INDEX: 'setResetPageIndex',      // 设置重置pageIndex
  SET_CURRENT_PLAY_QUEUE: 'setCurrentPlayQueue',  // 设置当前播放队列

  SET_CACHE_QUEUE: 'setCacheQueue',               // 设置缓存队列（临时）
  SET_RECENT_PLAY_SONGS: 'setRecentPlaySongs',    // 设置最近播放过的歌曲
  SET_COL_SONGS: 'setColSongs',                   // 设置收藏歌曲
  SET_COL_PLAYLISTS: 'setColPlaylists',           // 设置收藏歌单
}