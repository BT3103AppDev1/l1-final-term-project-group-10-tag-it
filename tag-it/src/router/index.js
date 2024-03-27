import { createRouter, createWebHistory } from "vue-router";
import ForgotPassword from "@/views/ForgotPassword.vue"
import ResetPassword from "@/views/ResetPassword.vue"
import EditProfile from "@/views/EditProfile.vue"

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
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router