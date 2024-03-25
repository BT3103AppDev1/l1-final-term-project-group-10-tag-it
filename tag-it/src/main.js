import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"
import Login from "./components/Login.vue";
import SignUp from "./components/SignUp.vue";

const app = createApp(App)

app.use(router)

app.mount("#app")