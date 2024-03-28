import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// import Login from "./components/Login.vue";
// import SignUp from "./components/SignUp.vue";
// import AllTags from "./components/AllTags.vue"

// createApp(App).mount("#app");

import router from "./router/index.js";
createApp(App).use(router).mount("#app");
