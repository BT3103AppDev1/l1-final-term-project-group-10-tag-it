<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router/index.js";
import { pushScopeId } from "vue";

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
        async signOut() {
            const auth = getAuth();
            const user = auth.currentUser;
            signOut(auth, user);
            // this.$router.push({name: 'Login'})
            router.push({ name: "Login" });
        },
    },
};
</script>

<template>
    <button id="btn" @click="signOut()" v-if="user">LogOut</button>
</template>

<style scoped></style>
