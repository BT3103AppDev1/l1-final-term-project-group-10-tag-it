<template>
<<<<<<< HEAD
    <h1>Tag-IT</h1>
    hello hi
=======
    <Navbar />
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
    <router-view />
</template>

<script>
<<<<<<< HEAD
export default {
    name: "App",
=======
import Navbar from "./components/Navbar.vue";

export default {
    name: "App",
    components: {
        Navbar,
    },
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
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
