<template>
    <Navbar />
    <router-view />
    <!-- <Navbar />
    

    <h1>Tag-IT</h1>
    hello hi
    <Login />
    <SignUp />
    <AllTags />
    <Footer /> -->
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
    name: "App",
    components: {
        Navbar,
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
