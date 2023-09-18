import Vue from 'vue'
import 'normalize.css';

import ElementUI from 'element-ui'; // 2.1引入结构
import 'element-ui/lib/theme-chalk/index.css'; // 2.2引入样式
import App from './App.vue';
// import Print from 'vue-print-nb';
// import  VueDragResize from 'vue-drag-resize'

Vue.use(ElementUI); // 3.安装

new Vue({
  el: '#app',
  render: h => h(App)
});
