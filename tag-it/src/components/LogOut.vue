<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
    name: "LogOut",
    data() {
        return {
            user: false,
        };
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        });
    },

    methods: {
        signOut() {
            const auth = getAuth();
            const user = auth.currentUser;
            signOut(auth, user);
            // this.$router.push({name: 'Login'})
        },
    },
};
</script>

<template>
    <button id="btn" @click="SignOut()" v-if="user">LogOut</button>
</template>

<style></style>
