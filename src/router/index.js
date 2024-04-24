import { createRouter, createWebHistory } from "vue-router";

// VIEWS
import AllTags from "@/views/AllTagsView.vue";
import Calendar from "@/views/Calendar.vue";
import EditProfile from "@/views/EditProfile.vue";
import Home from "@/views/Home.vue";

// COMPONENTS
import AllTagsComp from "@/components/AllTags.vue";
import ExpandedTagEntry from "@/components/ExpandedTagEntry.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import GoogleSignUp from "@/components/GoogleSignUp.vue";
import Groups from "@/components/Groups.vue";
import Login from "@/components/Login.vue";
import MiscellaneousTags from "@/components/MiscellaneousTags.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import SignUp from "@/components/SignUp.vue";
import CalendarComponent from '@/components/CalendarComponent.vue';


const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: "/",
        name: "GoogleSignUp",
        component: GoogleSignUp,
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
    },
    {
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
        CalendarComponent,
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
    {
        path: "/groups",
        name: "Groups",
        component: Groups,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
