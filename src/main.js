import './assets/main.css'

//import Vue from "vue";
//import VueRouter from "vue-router";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import "bootstrap/dist/css/bootstrap.min.css";

import App from './App.vue'
import router from './router/index'
import RouterPrefetch from "vue-router-prefetch";
import BlackDashboard from "./plugins/blackDashboard";

import i18n from "./i18n";
import "./registerServiceWorker";

const app = createApp(App)


app.use(createPinia())


app.use(router)
app.use(i18n)
app.use(BlackDashboard)
app.mount('#app')
//import "bootstrap/dist/js/bootstrap.min.js";

//Vue.use(createPinia())
//Vue.use(BlackDashboard);
//Vue.use(VueRouter);
//Vue.use(RouterPrefetch);
//new Vue({
//  router,
//  i18n,
//  render: (h) => h(App),
//}).$mount("#app");
