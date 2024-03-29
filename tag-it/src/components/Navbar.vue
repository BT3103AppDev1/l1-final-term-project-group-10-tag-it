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
