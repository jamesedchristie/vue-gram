import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'

Vue.config.productionTip = false


let app;
auth.onAuthStateChanged(user => {
  //Check if app is currently loaded
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
  //Check if user is curently logged in
  if (user) {
    store.dispatch('fetchUserProfile', user);
  }
});

