# 🎵 MOO音乐 

>使用uni-app、vue3、pinia、typescript、tailwindcss开发的可多端（支持移动端web网页、微信小程序、android、ios端等，**小程序端和ios端需自行打包**）运行的音乐播放器
- API数据来源[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- **[web端体验MOO](https://moo.osrc.com/)**
- **[安卓APP下载](https://github.com/lei1248276/MOO-music/releases)**
- **[ios书签版](https://jaye.osrc.com/static/moo.mobileconfig)（书签描述文件请使用手机浏览器打开安装，APP版需自行打包）**
- **微信小程序线上版（因资质问题，无法播放音乐，完整版需自行打包）**
- ![MOO](https://jaye.osrc.com/static/MOO.jpg)

### 技术栈
- 🚀 UI组件是自定义的 + uni-ui
- 🚀 vue3
- 🚀 pinia
- 🚀 tailwindcss + sass
- 🚀 vite
- 🚀 typescript、eslint
- 🚀 auto-imports

### 功能与页面
- 🎵 登录网易云音乐账号
- 🎵 获取网易云音乐收藏歌单
- 🎵 个人歌单、歌曲推荐
- 🎵 歌曲联想功能
- 🎵 banner歌单、歌曲展示
- 🎵 随机推荐歌单、歌曲
- 🎵 在线搜索歌单、歌曲、歌手
- 🎵 独立播放页面轮博展示
- 🎵 播放控制器
- 🎵 歌曲收藏
- 🎵 歌单收藏
- 🎵 专辑收藏
- 🎵 歌手收藏
- 🎵 历史播放记录
- 🎵 历史搜索记录
- 🎵 本地缓存歌单、音乐、歌手、专辑、历史记录

### 安装和使用
- install
```shell
pnpm install
```
- dev（app请使用HBuilderX）
```shell
pnpm dev:h5
```
```shell
pnpm dev:mp-weixin
```
- build（app请使用HBuilderX）
```shell
pnpm build:h5
```
```shell
pnpm build:mp-weixin
```


### 看图吧
<div style="display:flex;flex-wrap: wrap;gap: 4px;">
  <img src="https://jaye.osrc.com/static/play.gif" width="340px" height="600px">
  <img src="https://jaye.osrc.com/static/home.png" width="340px" height="600px">
  <img src="https://jaye.osrc.com/static/playlist.png" width="340px" height="600px">
  <img src="https://jaye.osrc.com/static/play.png" width="340px" height="600px">
</div>
