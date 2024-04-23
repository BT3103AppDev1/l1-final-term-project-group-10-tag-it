<template>
    <br /><br />
    <!-- <h5>MiscellaneousTags</h5> -->

    <div class="miscTagBox">
        <div id="topContents">
            <h3 id="miscTagHeader">Miscellaneous Tags</h3>
        </div>
        <!-- <hr class="header" /> -->
        <div class="tableDiv">
            <table id="miscTagTable">
                <tr v-for="(row, index) in tableRows" :key="row.tag_id">
                    <td>
                        <i @click="checkbutton(row.tag_id, row.completed)">
                            <BIconCircle
                                v-if="!row.completed"
                                class="unchecked"
                            />
                            <BIconCheckCircleFill v-else class="check" />
                        </i>
                    </td>
                    <td>{{ row.title }}</td>
                    <td>
                        <i class="trash" @click="deleteTag(row.tag_id)"
                            ><BIconTrashFill
                        /></i>
                    </td>
                </tr>
            </table>
        </div>

        <div class="quickTagComponent" @click="addQuickTag">
            <BIconPlusCircleFill
                v-if="addingtag === false"
                class="addQuickTagButton"
            />
            <QuickTagEntry v-else class="quickTagEntry" @refresh-required="handleRefresh" @openExpandedTagEntry="openETE"/>
        </div>
    </div>

    <br /><br />
</template>

<script>
import QuickTagEntry from "@/components/QuickTagEntry.vue";
import {
    BIconFlagFill,
    BIconTrashFill,
    BIconCircle,
    BIconCheckCircleFill,
    BIconPlusCircleFill,
} from "bootstrap-icons-vue";
import firebaseApp, { auth } from "../firebase.js";
import { Firestore, getFirestore, updateDoc } from "firebase/firestore";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    deleteDoc,
    arrayRemove,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
    components: {
        QuickTagEntry,
        BIconFlagFill,
        BIconTrashFill,
        BIconCircle,
        BIconCheckCircleFill,
        BIconPlusCircleFill,
    },
    data() {
        return {
            tableRows: [],
            addingtag: false,
            user_id: "",
            miscCal_id: "",
        };
    },
    async mounted() {
        auth.onAuthStateChanged((user) => {
            this.user_id = user.uid;

            this.fetchAndDisplayData(); //add authentication
        });
    },
    emits: ['openExpandedTE'],
    methods: {

        handleRefresh(){
            this.fetchAndDisplayData();
        },

        openETE() {
            this.$emit('openExpandedTE')
        },

        async checkbutton(tag_id, completed_status) {
            //when synced with firestore, change to async + put in export default? under mount?
            console.log("Icon clicked!", tag_id, completed_status);
            try {
                let toggle_completed = completed_status === true ? false : true;
                const fieldToUpdate = { completed: toggle_completed };
                await updateDoc(doc(db, "Tags", tag_id), fieldToUpdate);
                console.log("current state: " + toggle_completed);

                await this.fetchAndDisplayData();
            } catch (error) {
                console.log("CAUGHT ERROR!", error);
            }
        },
        async deleteTag(tag_id) {
            alert("You are going to delete: " + tag_id);
            console.log("removing " + tag_id + " from " + this.miscCal_id);

            //remove the tag from tags field in misc calendar
            const miscCalDocRef = doc(db, "Calendar", this.miscCal_id);
            await updateDoc(miscCalDocRef, {
                tags: arrayRemove(tag_id),
            });

            await deleteDoc(doc(db, "Tags", tag_id));

            await this.fetchAndDisplayData();
            console.log("sucessfullly deleted!", tag_id);
        },

        async fetchAndDisplayData() {
            //get user's misc calendar id
            let user_data = await getDoc(doc(db, "User", this.user_id));
            this.miscCal_id = user_data.data().misc_calendar;

            let miscCalDoc = await getDoc(doc(db, "Calendar", this.miscCal_id));
            let miscTags = miscCalDoc.data().tags;

            console.log(miscTags);

            this.tableRows = await Promise.all(
                miscTags.map(async (tagId) => {
                    let cur_tag_doc = await getDoc(doc(db, "Tags", tagId));

                    let documentData = cur_tag_doc.data();

                    let title = documentData.title;
                    let completed = documentData.completed;
                    let end = documentData.end;
                    let start = documentData.start;
                    let calendar_id = documentData.calendar_id;
                    let calendar_name = documentData.calendar_name;
                    let tag_id = cur_tag_doc.id;
                    let flagged = documentData.flagged;

                    return {
                        title,
                        completed,
                        end,
                        start,
                        calendar_id,
                        calendar_name,
                        tag_id,
                        flagged,
                    };
                })
            );
            //filter for those that have no calendar
            this.tableRows = this.tableRows.filter((row) => !row.calendar_name);
        },

        addQuickTag(event) {
            // do we need a cancllation button - or will it auto cancel itself
            console.log("Add Quick Tag");
            this.addingtag = true;
        },
    },
};
</script>

<style scoped>
@import "@/assets/main.css";

.miscTagBox {
    background-color: #f5f5f5;
    width: 390px;
    height: 520px;
    border-radius: 20px;
    border-width: 1px;
    border-color: #cacaca;
    margin: auto;
    font-family: cabin;
    font-size: 18px;
    position: relative;
    filter: drop-shadow(2px 2px #cacaca);
}

.tableDiv {
    overflow-y: auto;
    max-height: 330px;
}

.quickTagEntry {
    text-align: center;
    padding: 15px;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
}

.addQuickTagButton {
    color: rgb(87, 139, 207);
    font-size: 80px;
    text-shadow: rgb(87, 139, 207);
    text-align: center;
    padding: 15px;
    bottom: 0;
    right: 15px;
    position: absolute;
}

.addQuickTagButton:hover {
    color: #0461ad;
}

#miscTagHeader {
    padding: 30px 30px 15px 30px;
    font-size: 32.5px;
    font-weight: bold;
    letter-spacing: 2px;
    /* font-family: Montserrat; */
    color: rgb(87, 139, 207);
    /* background-color: #a0b6db; */
    border-radius: 20px 20px 0px 0px;
}

hr {
    height: 2px;
    width: 350px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid;
    color: rgb(87, 139, 207);
    opacity: 100%;
    background-color: rgb(87, 139, 207);
}

table {
    background-color: #f5f5f5;
    color: #a0b6db;
    text-align: center;
    font-family: cabin;
    width: 90%;
    margin: auto;
    border-spacing: 0;
    border: 0.5px solid #f5f5f5;
    border-radius: 25px;
    padding: 10px;
    /* need something to fix the height of the table */
}

td {
    padding: 10px 0px 10px 0px;
    height: 30px;
    font-family: cabin;
    border-bottom: 1px solid #a0b6db;
    text-align: left;
    color: #6c7a94;
}

/* .flagged{
        color: #bf2a2a;
    } */

.unchecked {
    color: #516282;
    font-size: 30px;
}

.check {
    color: #7dab87;
    font-size: 30px;
}

.trash {
    color: #919191;
}
</style>
