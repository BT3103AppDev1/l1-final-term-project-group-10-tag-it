<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router/index.js";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export async function signOutToast() {
  toast.promise(this.signOutFunc(), {
    pending: "Signing out...",
    success: "Successfully logged out!",
    error: "Failed to log out",
  });
}

export async function signOutFunc() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      signOut(auth)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      // No user is signed in
      reject(); // Resolve immediately as there is no action needed
    }
  });
}

export default {
  name: "LogOut",
  data() {
    return {
      user: false,
    };
  },
  //hello
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
  <button id="btn" @click="signOutToast()" v-if="user">LogOut</button>
</template>

<style scoped></style>
