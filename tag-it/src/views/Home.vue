<template>
    <div>
        <!-- <Navbar /> -->
        <div class="full-page-bg">
            <div class="texts">
                <h1 class="welcome-msg">
                    Welcome {{ username }}!
                    <!-- name will be accessed from the database -->
                </h1>
                <h1 class="tags-msg">
                    Your have 4 Tags today!
                    <!-- number of Tags will be accessed from the database -->
                </h1>
            </div>
            <Footer2 />
        </div>
    </div>
</template>

<script>
import firebaseApp, { auth } from "../firebase.js";
import { getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer2 from "@/components/Footer2.vue";
import Navbar from "@/components/Navbar.vue";

const db = getFirestore(firebaseApp);

export default {
    name: "Home",

    data() {
        return {
            username: "",
        };
    },

    mounted() {
        this.getName();
    },
    components: {
        // Navbar,
        Footer2,
    },

    methods: {
        async getName() {
            const db = getFirestore();
            const user = auth.currentUser;
            const userDocRef = doc(db, "User", user.uid);
            try {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    this.username = userDocSnap.data().first_name;
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        },
    },
};
</script>

<style scoped>
.texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
}
.welcome-msg {
    color: #fff;
    font-size: 7vh;
    margin-top: 30px;
    margin-bottom: 40px;
}

.tags-msg {
    color: #000;
    font-size: 7vh;
}

.full-page-bg {
    height: 100vh; /* make sure it covers the full viewport height */
    /* background-color: #343a40;  */
    background-image: linear-gradient(#fff, #0a42ad);
}
</style>
