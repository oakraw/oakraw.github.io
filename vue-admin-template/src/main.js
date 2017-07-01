// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './components/App';
import store from './store';
import router from './router';
import Auth from './services/auth';

Vue.use(Vuetify);
Vue.use(Auth);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created: () => {
    window.Vue = this;
  },
  router,
  store,
  render: h => h(App),
});
