import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import '@/assets/css/global.css'
import '@/assets/css/fonticon.css'
import './plugins/element.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;//必须返回请求，不然会出错
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false
// Vue.use(ElementUI)

Vue.use(VueQuillEditor);

Vue.filter('dateFormat', function (originValue) {
  let buildtime = new Date(originValue);
  let year = buildtime.getFullYear();
  let month = buildtime.getMonth() + 1;
  let date = buildtime.getDate();
  let hours = buildtime.getHours();
  let minutes = buildtime.getMinutes();
  let seconds = buildtime.getSeconds();
  let add_time_str = `${year}-${month}-${date < 10 ? "0" + date : date} ${
    hours < 10 ? "0" + hours : hours
    }:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  return add_time_str;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
