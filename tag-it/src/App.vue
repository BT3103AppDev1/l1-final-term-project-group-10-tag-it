<template>
    <h1>Tag-IT</h1>
    hello hi
    <!-- <Login /> -->
    <testLogin />
</template>

<script>
//import Login from "@/components/Login.vue";
import testLogin from "@/components/testLogin.vue";

export default {
    name: "App",
    components: {
        testLogin,
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
