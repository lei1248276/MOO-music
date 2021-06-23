export const BASE_URL = 'https://netease-music-api.fe-mm.com';

// export const BASE_URL = 'http://localhost:3000';

// 请求 banner 数据
export function getBanner() {
  return uni.request({
    url: `${BASE_URL}/banner`
  })
}

// 请求 recommend 数据
export function getRecommend() {
  return uni.request({
    url: `${BASE_URL}/personalized?limit=3`
  })
}

// 请求 playlist 数据
export function getPlaylist(id) {
  return uni.request({
    url: `${BASE_URL}/playlist/detail?id=${id}`
  })
}

// 请求所有 playlist 数据
export function getPlaylistAll(offset, limit) {
  return uni.request({
    url: `${BASE_URL}/top/playlist?limit=${limit}&order=all&offset=${offset}`
  })
}

// 请求 album 数据
export function getAlbum() {
  return uni.request({
    url: `${BASE_URL}/album/list?limit=3`
  })
}

// 请求 songs 详情数据
export function getSongs(ids) {
  return uni.request({
    url: `${BASE_URL}/song/detail?ids=${ids}`
  })
}

// 请求 songUrl 数据
export function getSongUrl(id) {
  return uni.request({
    url: `${BASE_URL}/song/url?id=${id}`,
    timeout: 3000
  })
}

// 请求 songLyric 数据
export function getLyric(id) {
  return uni.request({
    url: `${BASE_URL}/lyric?id=${id}`,
    timeout: 3000
  })
}
