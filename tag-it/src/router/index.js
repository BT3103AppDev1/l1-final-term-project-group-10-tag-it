import { createRouter, createWebHistory } from "vue-router";
// import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import AllTags from '@/views/AllTags.vue';
import Login from '@/components/Login.vue';
import AllTagsComp from '@/components/AllTags.vue';
import Calendar from "@/views/Calendar.vue";
import ExpandedTagEntry from '@/components/ExpandedTagEntry.vue';
import MiscellaneousTags from '@/components/MiscellaneousTags.vue';



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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
