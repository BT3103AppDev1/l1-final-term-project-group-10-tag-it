<template>
    <div>
        <Navbar />
        <router-view />
        <ProgressBar />
        <div class="full-page-bg">
            <div class="texts">
                <h1 class="welcome-msg">
                    Welcome {{ username }}!
                    <!-- name will be accessed from the database -->
                </h1>
                <h1 class="tags-msg">
                    You have {{ tags }} Tags today!
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
import ProgressBar from "@/components/ProgressBar.vue";
// import ChartTest from "@/components/ChartTest.vue";

const db = getFirestore(firebaseApp);

export default {
    name: "Home",

    data() {
        return {
            username: '',
            user_id: '',
            user_calendars: [],
            tags: 0,

        };
    },

    mounted() {
        auth.onAuthStateChanged(async user => {
            if (user) {
                let userDocRef = doc(db, "User", user.uid);   
                // console.log(user.uid);
                this.user_id = user.uid;
                // console.log(this.user_id);
                let userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    this.username = userDocSnap.data().first_name;
                }
            }
            // console.log(this.user_id);
            this.getTagCount();
        });    
    },
    components: {
        ProgressBar,
        Footer2,
        Navbar
    },

    methods: {
        async getTagCount() {
            console.log(this.user_id)
            const objToMap = obj => new Map(Object.entries(obj));

            let user_data = await getDoc(doc(db, "User", this.user_id))
            let personal_calendars = objToMap(user_data.data().personal_calendars)
            let shared_calendars = objToMap(user_data.data().shared_calendars)
            let miscCal_id = user_data.data().misc_calendar

            //adding personal calendar id from personal calendars
            if (personal_calendars.size > 0) {
                personal_calendars.forEach((value, key) => {
                    this.user_calendars.push(key)
                })
            }

            //adding shared calendar id from shared calendars
            if (shared_calendars.size > 0) {
                shared_calendars.forEach((value, key) => {
                    this.user_calendars.push(key)
                })
            }

            this.user_calendars.push(miscCal_id);
            console.log(this.user_calendars);
            // console.log(this.user_calendars[0]);
            // const calDoc = await getDoc(doc(db, "Calendar", this.user_calendars[0]));
            // const calTags = calDoc.data().tags;
            // console.log(calTags.length);
            
            let count = 0;
            try {
                for (let i = 0; i < this.user_calendars.length; i++) {
                    const calDoc = await getDoc(doc(db, "Calendar", this.user_calendars[i]));
                    
                    if (calDoc.exists() && calDoc.data().tags && Array.isArray(calDoc.data().tags)) {
                        const calTags = calDoc.data().tags;
                        console.log(calTags.length);
                        count += calTags.length;
                    
                    }
                }
                console.log("Total tags:", count);
            } catch (error) {
                console.error("Error fetching tags:", error);
                count = 0;
            }
            this.tags = count;
            console.log(this.tags);
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
    color: #0a42ad;
    font-size: 7vh;
    margin-top: 30px;
    margin-bottom: 40px;
}

.tags-msg {
    color: #000;
    font-size: 7vh;
}

.full-page-bg {
    height: 100%; /* make sure it covers the full viewport height */
    /* background-color: #343a40;  */
    background-image: linear-gradient(#fff, #0a42ad);
}
</style>
