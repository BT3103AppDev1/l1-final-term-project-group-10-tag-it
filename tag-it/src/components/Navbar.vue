<template>
    <div id="logged" v-if="user">
        <div id="nav">
            <router-link to="/home">Home</router-link> |
            <router-link to="/login">Login</router-link>
        </div>
    </div>
</template>

<script>
// FOR NEXT TIME

import { getauth, onAuthstatechanged } from "firebase/auth";
export default {
    name: "NavBar",
    data() {
        return {
            user: false,
        };
    },
    mounted() {
        const auth = getauth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        });
    },
};
</script>
<<<<<<< HEAD
=======

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.nav-item{
    font-family: 'Montserrat', sans-serif;
    margin-right: 50px;
    /* font-size:  1.5vw; */
    font-size:  20px;
    font-weight: bold;
    color: #0A42AD;
    border-right: 0.1rem solid #000; /* Add a border right */
    padding-right: 50px; 
}

.nav-item-group {
    font-family: 'Montserrat', sans-serif;
    margin-right: 50px;
    font-size:  20px;
    font-weight: bold;
    color: #0A42AD;
}

hr {
    opacity: 0.5;
    margin-bottom: 10%;
}

.navbar-nav {
    margin: 0;
    padding: 0;
}

button {
    background-color: transparent;
    border: transparent;
}

nav {
    height: 120px;
    background-color: white;
}

</style>
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
