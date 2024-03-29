import { createRouter, createWebHistory } from "vue-router";
// import Login from "@/components/Login.vue";
import Home from "@/views/Home.vue";
import AllTags from '@/views/AllTags.vue';
import Login from '@/components/Login.vue';
import AllTagsComp from '@/components/AllTags.vue';


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
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
