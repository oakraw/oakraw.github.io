/* eslint no-use-before-define: 0 */
import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Dashboard from '@/components/Dashboard';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: Login,
  }, {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: guardRoute,
    children: [{
      path: '',
      name: 'profile',
      icon: 'account_circle',
      component: Profile,
    }, {
      path: 'dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      component: Dashboard,
    }],
  }],
});

function guardRoute(to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
  const auth = router.app.$options.store.state.auth;

  if (!auth.isLoggedIn) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  } else {
    next();
  }
}

// router.routes = [{
//   path: '/login',
//   name: 'login',
//   component: Login,
// }, {
//   path: '/',
//   name: 'home',
//   component: Home,
// }];


export default router;
