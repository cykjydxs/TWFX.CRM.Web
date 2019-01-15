// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment';
import linq from 'linq';
import 'babel-polyfill';

import {http_Get,http_Post,http_PostUp} from './api/Api.js'
import routes from './router/index.js'
import vueList from './router/menu.js'
import global from './global.js'
import App from './App'


//启动是否产生提示
Vue.config.productionTip = false;
//资源使用
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.Enumerable =linq;
Vue.prototype.$VueList=vueList;
Vue.prototype.Global=global;
Vue.prototype.myMoment=moment;

//日期过滤器
Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return moment(value).format(formatString);
});
//金额过滤器
Vue.filter('money', function (sValue, sPos) {
  sValue = parseFloat(sValue);
  let v = String(Math.round(sValue * Math.pow(10, sPos)) / Math.pow(10, sPos));
  let b = v.indexOf('.');
  let n = "";
  if (b == -1) {
    for (let i = 0; i < sPos; i++) {
      n += "0";
    }
    return v + "." + n;
  } else {
    if (v.length - b < sPos + 1) {
      for (let i = 0; i < sPos + 1 - (v.length - b) ; i++) {
        n += "0";
      }
      return v + n;
    }
    return (v);
  }
});


//axios封装
Vue.prototype.$httpGet=http_Get;
Vue.prototype.$httpPost=http_Post;
Vue.prototype.$httpPostUp=http_PostUp;

//路由
const router = new VueRouter({
  routes
});
//登录验证
router.beforeEach((to, from, next) => {
  if (to.path == '/Login') {
    sessionStorage.removeItem('twfxuser');
  }
  var user = sessionStorage.getItem('twfxuser');
  if (!user && to.path != '/Login') {
    next({path: '/Login', replace: true, query: {redirect: to.fullPath}});
  } else {
    next();
  }
});



//根实例（最后）
var vm=new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});



