import { createRouter, createWebHistory } from "vue-router";

<<<<<<< HEAD
import Home from "@/views/Home.vue";
import Login from "@/components/Login.vue";
import SignUp from "@/components/SignUp.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import EditProfile from "@/views/EditProfile.vue";
=======
// VIEWS
import AllTags from "@/views/AllTagsView.vue";
import Calendar from "@/views/Calendar.vue";
import EditProfile from "@/views/EditProfile.vue";
import Home from "@/views/Home.vue";

// COMPONENTS
import AllTagsComp from "@/components/AllTags.vue";
import ExpandedTagEntry from "@/components/ExpandedTagEntry.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import Login from "@/components/Login.vue";
import MiscellaneousTags from "@/components/MiscellaneousTags.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import SignUp from "@/components/SignUp.vue";
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3

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
<<<<<<< HEAD
        path: "/signUp",
        name: "SignUp",
        component: SignUp,
    },
    {
=======
        path: "/alltags",
        name: "AllTags",
        component: AllTags,
        AllTagsComp,
    },
    {
        path: "/calendar",
        name: "Calendar",
        component: Calendar,
        ExpandedTagEntry,
        MiscellaneousTags,
    },
    {
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
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
<<<<<<< HEAD
];

const router = createRouter({ history: createWebHistory(), routes });
=======
    {
        path: "/signUp",
        name: "SignUp",
        component: SignUp,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3

export default router;
