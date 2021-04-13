import {getSongUrl} from "@/network/index";
import types from './mutations-types';

export default {
  getPlaySong({state, commit}, payload) {
    // 避免重复发送网络请求（填坑）
    state.lock = true;

    let cache = state.cacheQueue;
    if (!payload.songUrl || !cache.has(payload.id)) {
      // console.log(`没有cache`);

      getSongUrl(payload.id).then(res => {
        state.lock = false;
        const [err, data] = res;
        let url = data.data.data[0].url;
        // console.log(url);
        if (url) {
          // console.log(payload.playlistId);
          // 设置audio url
          state.audio.src = url;
          // 设置缓存url
          payload.songUrl = url;
          // 歌曲临时缓存队列
          commit(types.SET_CACHE_QUEUE, payload);
          // 设置当前播放歌曲
          commit(types.SET_CURRENT_SONG, payload);
          // 设置最近播放歌曲列表
          payload.playlistId !== 'recent' && commit(types.SET_RECENT_PLAY_SONGS, payload);
        } else {
          throw new Error;
        }
      }).catch(err => {
        console.log(err);
        state.lock = false;
        uni.showToast({
          title: '歌曲链接失效！',
          icon: 'loading',
        })
      })
    } else {
      // console.log(`cache命中`);

      // 同样异步执行保持一致
      setTimeout(() => state.lock = false);

      // 覆盖一下之前的缓存修改playlistId属性（因为有可能是来自最近播放中的或是其他缓存）
      cache.set(payload.id, payload);
      cache = cache.get(payload.id);
      // 设置audio url
      state.audio.src = cache.songUrl;
      // 设置当前播放歌曲
      commit(types.SET_CURRENT_SONG, cache);
      // 设置最近播放歌曲列表
      payload.playlistId !== 'recent' && commit(types.SET_RECENT_PLAY_SONGS, cache);
    }
  }
}