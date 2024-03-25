import { createRouter, createWebHistory } from "vue-router";
import ForgotPassword from "@/views/ForgotPassword.vue"
import ResetPassword from "@/views/ResetPassword.vue"

const routes = [
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router