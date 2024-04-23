<template>
    <div class="smallerGrid">
        <div id="1" class="smallBentoCurvedRectangle">
            <div class="tag-container">
                <div class="infoIcon">
                    <BIconTagsFill />
                </div>
                <div class="infoContainer">
                    <div class="infoNumber">
                        {{ totalTags }}
                    </div>
                    <div class="infoText">Total</div>
                </div>
            </div>
        </div>
        <div id="2" class="smallBentoCurvedRectangle">
            <div class="tag-container">
                <div class="infoIcon">
                    <BIconFlagFill />
                </div>
                <div class="infoContainer">
                    <div class="infoNumber">
                        {{ importantTags }}
                    </div>
                    <div class="infoText">Important</div>
                </div>
            </div>
        </div>
        <div id="3" class="smallBentoCurvedRectangle">
            <div class="tag-container">
                <div class="infoIcon">
                    <BIconCalendar2DateFill />
                </div>
                <div class="infoContainer">
                    <div class="infoNumber">
                        {{ todayTags }}
                    </div>
                    <div class="infoText">Today</div>
                </div>
            </div>
        </div>
        <div id="4" class="smallBentoCurvedRectangle">
            <div class="tag-container">
                <div class="infoIcon">
                    <BIconCalendarWeek />
                </div>
                <div class="infoContainer">
                    <div class="infoNumber">
                        {{ weekTags }}
                    </div>
                    <div class="infoText">This Week</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    BIconTagsFill,
    BIconCalendar2DateFill,
    BIconCalendarWeek,
    BIconFlagFill,
} from "bootstrap-icons-vue";

import firebaseApp, { auth } from "../firebase.js";
import { getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    name: "FourMetrics",

    data() {
        return {
            totalTags: 0,
            importantTags: 0,
            todayTags: 0,
            weekTags: 0,

            username: "User",
            user_id: "",
            user_calendars: [],
            tags: 0,
        };
    },
    components: {
        BIconTagsFill,
        BIconCalendar2DateFill,
        BIconCalendarWeek,
        BIconFlagFill,
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
            this.totalTags = count;
        },
    },
};
</script>

<style>
.smallerGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
}

.smallBentoCurvedRectangle {
    background-color: #f2f2f2;
    color: #686868;
    filter: drop-shadow(2px 2px #919191);

    padding: 5px 15px 5px 15px;

    border-radius: 15px;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
    display: flex;
}

.tag-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 100%;
}

.infoIcon {
    color: #406cbe;
    margin: 0;
    display: block;
    background-size: cover;
    font-weight: bold;
    font-size: 3.5em;
}
.infoContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
}
.infoNumber {
    font-size: 3em;
    font-weight: bold;
}
.infoText {
    font-weight: bold;
    font-size: 1.5em;
}
</style>
