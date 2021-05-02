import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import common from './common'
Vue.use(common)

import ipcRenderer from './ipcRenderer'
Vue.use(ipcRenderer)

import electronStore from './electronStore'
Vue.use(electronStore)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
