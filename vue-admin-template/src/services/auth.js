/* eslint no-multi-assign: 0 */

import Vue from 'vue';
import router from '@/router';
import store from '@/store';

export default {

  install() {
    Vue.prototype.$auth = Vue.auth = this;
  },

  login() {
    const response = {
      body: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
    };

    this.storeToken(response);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Success!');
      }, 2500);
    });
  },

  storeToken(response) {
    const auth = store.state.auth;
    const user = store.state.user;

    auth.isLoggedIn = true;
    auth.accessToken = response.body.access_token;
    auth.refreshToken = response.body.refresh_token;
    // TODO: get user's name from response from Oauth server.
    user.name = 'John Smith';

    store.commit('UPDATE_AUTH', auth);
    store.commit('UPDATE_USER', user);
  },

  logout() {
    store.commit('CLEAR_ALL_DATA');
    router.push({
      name: 'login',
    });
  },
};
