import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/components/Login.vue";
import SignUp from "@/components/SignUp.vue";
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
    {
        path: "/signUp",
        name: "SignUp",
        component: SignUp,
    },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
