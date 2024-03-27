<template>
    <h1>Tag-IT</h1>
    hello hi
    <!-- <Login /> -->
    <Login />
    <SignUp />
    <AllTags />
    <ExpandedTagEntry />
    <MiscellaneousTags />
</template>

<script>
//import Login from "@/components/Login.vue";
import Login from "@/components/Login.vue";
import SignUp from "@/components/SignUp.vue";
import AllTags from "@/components/AllTags.vue";
import ExpandedTagEntry from '@/components/ExpandedTagEntry.vue';
import MiscellaneousTags from '@/components/MiscellaneousTags.vue';

export default {
    name: "App",
    components: {
        Login,
        SignUp,
        AllTags,
        ExpandedTagEntry,
        MiscellaneousTags,
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 30px;
}
#nav {
    padding: 30px;
}
#nav a {
    font-weight: bold;

    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
    width: 50%;
}
</style>
