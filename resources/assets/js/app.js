import './bootstrap';
import Vue from 'vue'; // Importing Vue Library
import VueRouter from 'vue-router'; // importing Vue router library
import VueMoment from 'vue-moment';
import router from './routes';


window.Vue = Vue;
Vue.use(VueRouter);
Vue.use(VueMoment);


const app = new Vue({
    el: '#app',
    router
});