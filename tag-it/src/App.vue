<template>
    <h1>Tag-IT</h1>
    hello hi
    <!-- <Login /> -->
    <Login />
    <SignUp />

    <router-view />
</template>

<script>
//import Login from "@/components/Login.vue";
import Login from "@/components/Login.vue";
import SignUp from "@/components/SignUp.vue";

export default {
    name: "App",
    components: {
        Login,
        SignUp,
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
}
</style>
