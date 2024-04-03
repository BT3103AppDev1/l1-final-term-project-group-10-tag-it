import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from './router/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.css';

createApp(App).use(router).mount("#app");
