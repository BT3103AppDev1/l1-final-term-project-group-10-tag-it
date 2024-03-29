<template>
    <Navbar/>
    <Login/>
</template>

<script>
import Login from '@/components/Login.vue';
import Navbar from '@/components/Navbar.vue';

export default {
    name: "Login",
    components: {
        Navbar,
        Login
    }
}
</script>