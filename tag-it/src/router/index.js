import { createRouter, createWebHistory } from "vue-router";
// import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import AllTags from '@/views/AllTags.vue';
import Login from '@/components/Login.vue';
import AllTagsComp from '@/components/AllTags.vue';
import Calendar from "@/views/Calendar.vue";
import ExpandedTagEntry from '@/components/ExpandedTagEntry.vue';
import MiscellaneousTags from '@/components/MiscellaneousTags.vue';
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import EditProfile from "@/views/EditProfile.vue";
import SignUp from "@/components/SignUp.vue";



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
        path: "/alltags",
        name: "AllTags",
        component: AllTags, AllTagsComp,
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: Calendar, ExpandedTagEntry, MiscellaneousTags,
    },
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
    },
    {
        path: "/signUp",
        name: "SignUp",
        component: SignUp,
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
