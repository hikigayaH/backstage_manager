import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
import '@/assets/css/global.css'
import '@/assets/css/fonticon.css'
import './plugins/element.js'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

axios.interceptors.request.use(config=>{
  console.log(config);
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;//必须返回请求，不然会出错
})

Vue.prototype.$http = axios;

Vue.config.productionTip = false
// Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
