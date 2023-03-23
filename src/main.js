import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./plugins/element.js";
import "./plugins/charts"
import "./permission"
import "./assets/styles/index.less"
import "./assets/styles/ruoyi.less"
import "./assets/icons/iconfont.css";
import "./assets/icons/iconfont.js";
import './assets/icons/index'
import RightToolbar from "./components/RightToolbar"
import Pagination from "./components/Pagination"
import DictData from "./components/DictData"
import plugins from './plugins';

import directive from './directive'

import { resetForm, addDateRange } from './utils/ruoyi'

Vue.config.productionTip = false
Vue.component('RightToolbar', RightToolbar)
Vue.component('Pagination', Pagination)

Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange

DictData.install()

Vue.use(plugins)
Vue.use(directive)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
