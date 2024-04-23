<template></template>

<script>
import firebaseApp, { auth } from "../firebase.js";
import { getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import Footer2 from "@/components/Footer2.vue";

const db = getFirestore(firebaseApp);

export default {
    name: "Analytics",

    data() {
        return {
            username: "User",
            user_id: "",
            user_calendars: [],
            tags: 0,

            totalTags: 5,
            importantTags: 4,
            todayTags: 3,
            weekTags: 2,
        };
    },

    mounted() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                let userDocRef = doc(db, "User", user.uid);
                this.user_id = user.uid;
                let userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    this.username = userDocSnap.data().first_name;
                }
            }
            this.getTagCount();
        });
    },
    components: {
        Footer2,
    },

    methods: {
        async getTagCount() {
            const objToMap = (obj) => new Map(Object.entries(obj));

            let user_data = await getDoc(doc(db, "User", this.user_id));
            let personal_calendars = objToMap(
                user_data.data().personal_calendars
            );
            let shared_calendars = objToMap(user_data.data().shared_calendars);
            let miscCal_id = user_data.data().misc_calendar;

            //adding personal calendar id from personal calendars
            if (personal_calendars.size > 0) {
                personal_calendars.forEach((value, key) => {
                    this.user_calendars.push(key);
                });
            }

            //adding shared calendar id from shared calendars
            if (shared_calendars.size > 0) {
                shared_calendars.forEach((value, key) => {
                    this.user_calendars.push(key);
                });
            }

            this.user_calendars.push(miscCal_id);

            let count = 0;
            try {
                for (let i = 0; i < this.user_calendars.length; i++) {
                    const calDoc = await getDoc(
                        doc(db, "Calendar", this.user_calendars[i])
                    );

                    if (
                        calDoc.exists() &&
                        calDoc.data().tags &&
                        Array.isArray(calDoc.data().tags)
                    ) {
                        const calTags = calDoc.data().tags;
                        count += calTags.length;
                    }
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
                count = 0;
            }
            this.tags = count;
        },
    },
};

// let totalTags = {
//     count: 100
// }

// export const totalTags;
// export const importantTags;
// export const todayTags;
// export const weekTags;
</script>
