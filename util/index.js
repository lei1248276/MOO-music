// 将播放列表分组
export function dividePlaylist(data) {
  let arr = [], temp = [];
  for (var i = 0, len = data.length; i < len; i++) {
    temp.push({
      picUrl: data[i].coverImgUrl,
      name: data[i].name,
      updateTime: data[i].updateTime,
      id: data[i].id,
      creatorImg: data[i].creator.avatarUrl,
      creatorNickname: data[i].creator.nickname,
      description: data[i].description,
      isCollect: false,
      isChecked: false,
      songCount: 0
    });
    if (temp.length === 3) {
      arr.push(temp);
      temp = [];
    }
  }
  return arr;
}


// 节流
export function throttle(cb, wait) {
  let oldTime = 0;
  return function (arg) {
    const now = Date.now();
    if (now - oldTime > wait) {
      cb.call(this, arg);
      oldTime = now;
    }
  }
}