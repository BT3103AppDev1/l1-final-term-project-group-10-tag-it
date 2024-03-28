import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/components/Login.vue";
// import ForgotPassword from "@/views/ForgotPassword.vue";
// import ResetPassword from "@/views/ResetPassword.vue";

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
    },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
