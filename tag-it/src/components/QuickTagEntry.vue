<template>
    <div class="quickAddTag">
        <form class="quickAddTagForm">
            <input
                type="text"
                placeholder="Quick add tag..."
                id="quickAddTag"
                required="yes"
                @keyup.enter="massAddTags"
            />
            <!-- not sure how to put icon over form -->
            <i class="expandTag" @click="expandTagEntry">
                <BIconArrowsAngleExpand
            /></i>
        </form>
    </div>
</template>

<script>
import { BIconArrowsAngleExpand } from "bootstrap-icons-vue";
import { onAuthStateChanged } from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

import firebaseApp, { auth } from "../firebase.js";

const db = getFirestore(firebaseApp);

export default {
    data() {
        return {
            user: null,
        };
    },
    created() {
        this.monitorAuthState();
    },
    methods: {
        monitorAuthState() {
            onAuthStateChanged(auth, (loggedUser) => {
                if (loggedUser) {
                    this.user = loggedUser;
                }
            });
        },
        expandTagEntry(event) {
            console.log("expanding tag");
            alert(
                "expand button works, will need to route to expanded tag entry"
            );
        },
        massAddTags() {
            const rawString = document.getElementById("quickAddTag").value;
            const splitList = rawString.split(",");

            Promise.all(db.collection("Users").doc(this.user.uid).get())
                .then((doc) => {
                    if (doc.exists) {
                        const misc_calendar_id = doc.data().misc_calendar;
                    }
                })
                .catch((error) => {
                    console.error("error getting doc");
                });
        },
    },

    props: {
        icon: BIconArrowsAngleExpand,
    },
};
</script>

<style scoped>
@import "@/assets/main.css";

.quickAddTag {
    font-family: cabin;
    font-size: 18px;
}

.quickAddTagForm i {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    pointer-events: auto;
}

input {
    border-radius: 25px;
    border-color: #a0b6db;
    background-color: #a0b6db;
    width: 340px;
    height: 52px;
    /* text-align: left; */
    border-width: 1px;
    padding: 0px 10px 0px 10px;
}

input::placeholder {
    color: #f5f5f5;
}

.expandTag {
    color: #f5f5f5;
}
</style>
