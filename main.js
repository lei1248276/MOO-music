import Vue from 'vue';
import App from './App';
import store from './store/index';
// loading
import UniLoading from "./components/loading/UniLoading";
// audio控制器
import UniAudioController from "./components/audio/UniAudioController";
// 模拟的playPage页面
import UniMockPlayPage from "./components/mockPlayPage/UniMockPlayPage";
// playPage页面图片预备图
import PrepareImg from "./components/prepareImg/PrepareImg";
// profile收藏页面数据备用图
import UniAlt from "./components/alt/UniAlt";
import UniCustomCheckbox from "./components/checkbox/UniCustomCheckbox";

Vue.component('uni-loading', UniLoading);
Vue.component('uni-audio-controller', UniAudioController);
Vue.component('uni-mock-play-page', UniMockPlayPage);
Vue.component('prepare-img', PrepareImg);
Vue.component('uni-alt', UniAlt);
Vue.component('uni-custom-checkbox', UniCustomCheckbox);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
