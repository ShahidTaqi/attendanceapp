import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueHtmlToPaper from 'vue-html-to-paper';
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.config.productionTip = false
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
Vue.use(VueHtmlToPaper, options);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
