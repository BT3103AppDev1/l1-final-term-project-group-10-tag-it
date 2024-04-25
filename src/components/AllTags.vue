<template>
    <!-- <h5> ALL TASK LIST</h5>
    <p> reordering of the tasks? yet to enable filter. set specific colors for the specific categories</p>
    <p> also are we able to edit the tags from here?</p>
    <p>this version doesnt use tag_id but the auto_generated id of the tag</p> -->
    <div class="allTagsContainer">
        
        <div id="padding">
        <!-- <BIconFunnelFill class="filterIcon" @click="filter" /> -->
        <table id = "AllTagsTable" class = "auto-index">
            <tr>
                <th>
                    <i @click="filterCompleted"> 
                        <BIconCircle v-if="!this.filterSettings.filterCompleted" class="unchecked" style="margin-left: 10px;"/>
                        <BIconCheckCircleFill v-else class="check"/>
                    </i>
                </th>
                
                <th>
                    <div class="filter-container">TITLE
                        <i @click="filterTitle">
                            <BIconSortAlphaDown v-if="this.filterSettings.sortState === 'ascending'" />
                            <BIconSortAlphaDownAlt v-if="this.filterSettings.sortState === 'descending'" />
                            <BIconSortAlphaDown v-if="this.filterSettings.sortState === 'none'" /> 
                        </i> 
                    </div>
                </th>
                <th><div class="filter-container">CALENDAR
                        <BIconArrowBarDown class="filterbutton" @click="filter"/> 
                        <div v-if="active">
                            <div class="dropdown-content">
                                <div class="opt-labels" v-for="(opt, index) in cals" :key="opt.cal_id">
                                    <input 
                                    id="checkboxes"
                                    type="checkbox" 
                                    :value="opt.cal_id" 
                                    :checked="checkedStates[opt.cal_id]"
                                    @change="getCal($event, opt.cal_id)">
                                        {{ opt.calendar_name }}
                                    <span class="checkmark"></span>
                                </div>
                                <!-- <label class="cal-option" v-for="(opt, index) in cals" :key="opt.cal_id"> -->
                                   
                                <!-- </label> -->
                            </div>
                        </div>
                    </div>
                </th>
                <th>
                    <div class="filter-container">START
                        <i @click="filterStartDate">
                            <BIconSortDown v-if="!this.filterSettings.filterStartDate"/>
                            <BIconSortDown v-if="this.filterSettings.filterStartDate" /> 
                        </i>
                    </div>
                </th>
                <th><div class="filter-container">END
                        <i @click="filterEndDate">
                            <BIconSortDown v-if="!this.filterSettings.filterEndDate"/>
                            <BIconSortDown v-if="this.filterSettings.filterEndDate" /> 
                        </i> 
                    </div>
                </th>

                <th>
                    <div class="filter-container">
                        <i @click="filterImpt">
                            <BIconFlag v-if="!this.filterSettings.filterImpt"/>
                            <BIconFlagFill v-if="this.filterSettings.filterImpt" /> 
                        </i>
                    </div>
                </th>
                <th>
                </th>
            </tr>

            <tr v-for="(row,index) in tableRows" :key="row.tag_id">
                <td><i @click="checkbutton(row.tag_id, row.completed)"> 
                    <BIconCircle v-if="!row.completed" class="unchecked" />
                    <BIconCheckCircleFill v-else class="check"/>
                </i></td>
                <td> {{ row.title }}</td>
                <td>
                    <div class="calendar" :style="{'background-color': row.color}">
                        {{ row.calendar }}
                    </div>
                </td>
                <td>{{ row.start }}</td>
                <td>{{ row.end }}</td>
                <td> <i @click="flagbutton(row.tag_id, row.flagged)">
                    <BIconFlag v-if="!row.flagged" />
                    <BIconFlagFill v-else class="flagged" />
                    </i>
                </td>
                <td><i class="trash" @click="deleteTag(row.tag_id)"><BIconTrashFill /></i></td>

            </tr>
            <br>
        </table> </div>
    </div> 

</template>

<script>

import { BIconFlag, BIconFlagFill, BIconTrashFill, BIconCircle, BIconCaretUpFill, BIconCheckCircleFill,BIconCaretRightFill, BIconFunnelFill, BIconCaretDownFill, BIconSortAlphaDownAlt, BIconSortAlphaDown, BIconSortDown, BIconArrowBarDown} from 'bootstrap-icons-vue';
import firebaseApp, { auth } from '../firebase.js';
import { arrayUnion, deleteField, deleteAllPersistentCacheIndexes } from 'firebase/firestore';
import { getFirestore, arrayRemove, doc, addDoc, query, where,  setDoc, updateDoc, getDoc, getDocs, deleteDoc, collection, documentId } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default {
    components: {
        BIconArrowBarDown,
        BIconSortDown,
        BIconFlag,
        BIconSortAlphaDown,
        BIconSortAlphaDownAlt,
        BIconFlagFill,
        BIconCaretRightFill,
        BIconTrashFill,
        BIconCircle,
        BIconCheckCircleFill,
        BIconFunnelFill,
        BIconCaretDownFill,
        BIconCaretUpFill
    },
    data(){
        return {
            tableRows: [],
            cals: [], // main array to store calendars in tuples
            filterCals: [],
            originalRows: [],
            checkedStates: {}, // for checked cals to remain checked even when dropdown is closed
            active: false,
            filterSettings : { // filter tools
                filterStartDate: false,
                filterEndDate: false,
                sortState: "none",
                filterImpt: false,
                filterCal: false,
                filterCompleted: false,
            },

            // user auth
            cal_name: '',
            cal_color: '',
            calName_calColor: {}, //populate with data from firebase
            calName_calId:{}, 
            user_id: '',
            user_calendars: [], // only their id
            miscCal_id: '',
        };
    },

    async mounted() {
        auth.onAuthStateChanged(user => {
        if (user) {
            this.user_id = user.uid;
            this.fetchData();

        }
    })},

    methods: {
        async filter() {
            this.active = !this.active;
        },

        async getUserCalendars() {

            this.user_calendars = [];
            this.cals = [];

            const objToMap = obj => new Map(Object.entries(obj));

            let user_data = await getDoc(doc(db, "User", this.user_id))
            let personal_calendars = objToMap(user_data.data().personal_calendars) 
            let shared_calendars = objToMap(user_data.data().shared_calendars)
            let cal = user_data.data().misc_calendar
            this.miscCal_id = cal;
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

            // populating this.cals
            if (this.user_calendars.length > 0) {
                const calendarCollection = collection(db, "Calendar");
                const chunks = [];
                for (let i = 0; i < this.user_calendars.length; i += 10) {
                    const chunk = this.user_calendars.slice(i, i + 10);
                    const querySnapshotPromise = getDocs(query(calendarCollection, where(documentId(), 'in', chunk)));
                    chunks.push(querySnapshotPromise);
                }
                
                const results = await Promise.all(chunks); // Resolve all batch queries
                this.cals = results.flatMap(querySnapshot => querySnapshot.docs.map(doc => ({
                    calendar_name: doc.data().calendar_name,
                    cal_id: doc.id
                })));
            }
            // this.miscCal_id = this.miscCal_id;
            this.fetchAndUpdateData();
        },

        async fetchData(){
            

            // get calendars of the current users
            await this.getUserCalendars();
            console.log(this.cals);

            //iterate through user calendars
            this.user_calendars.map(async (calId) => {
                let cur_cal_doc = await getDoc(doc(db, "Calendar", calId));
                let documentData = cur_cal_doc.data();
                let cal_id = cur_cal_doc.id;
                let cal_name = documentData.calendar_name;
                let cal_color = documentData.color;
                //setting up the dictionary of category to their specific colors
                this.calName_calColor[cal_name] = cal_color;
                this.calName_calId[cal_name] = cal_id;
                
            })
            
        },

        async filterStartDate() {
            let filteredRows = Array.from(this.originalRows);
            this.filterSettings.filterStartDate = !this.filterSettings.filterStartDate;
            if (this.filterSettings.filterStartDate) {
                filteredRows = filteredRows.sort((a, b) => {
                    const dA = new Date(a.start);
                    const dB = new Date(b.start);
                    console.log(dA);
                    if (!isNaN(dA) && !isNaN(dB)) {
                        return dA - dB;
                    } else if (isNaN(dA) && isNaN(dB)) {
                        return 0;
                    } else if (isNaN(dA) && !isNaN(dB)) {
                        return 1;
                    } else if (!isNaN(dA) && isNaN(dB)) {
                        return -1;
                    }
                });            
            }
            this.tableRows = filteredRows;
        },

        async filterCompleted() {
            let filteredRows = Array.from(this.originalRows);
            this.filterSettings.filterCompleted = !this.filterSettings.filterCompleted;
            if (this.filterSettings.filterCompleted) {
                filteredRows = filteredRows.filter(row => row.completed);
            }
            this.tableRows = filteredRows;
        },

        async filterEndDate() {
            let filteredRows = Array.from(this.originalRows);
            this.filterSettings.filterEndDate = !this.filterSettings.filterEndDate;
            if (this.filterSettings.filterEndDate) {
                console.log("SORTING END")
                filteredRows = filteredRows.sort((a, b) => {
                    const dA = new Date(a.end);
                    const dB = new Date(b.end);
                    if (!isNaN(dA) && !isNaN(dB)) {
                        return dA - dB;
                    } else if (isNaN(dA) && isNaN(dB)) {
                        return 0;
                    } else if (isNaN(dA) && !isNaN(dB)) {
                        return 1;
                    } else if (!isNaN(dA) && isNaN(dB)) {
                        return -1;
                    }
                });            
            }
            this.tableRows = filteredRows;
        },

        async filterImpt() {
            let filteredRows = Array.from(this.originalRows);
            this.filterSettings.filterImpt = !this.filterSettings.filterImpt;
            if (this.filterSettings.filterImpt) {
                filteredRows = filteredRows.filter(row => row.flagged);
            }
            this.tableRows = filteredRows;

        },

        async getCal(event, cal_id) {
            this.checkedStates[cal_id] = event.target.checked;
            console.log(this.checkedStates);
            const isChecked = event.target.checked;
            if (isChecked) {
                this.filterCals.push(cal_id);
                this.loadCals();
            } else {
                this.filterCals = this.filterCals.filter(item => item !== cal_id);
                this.loadCals();
            }
        },

        async loadCals() {
            if (this.filterCals.length === 0) {
                this.fetchAndUpdateData();
            } else {
                let newRows = [];
                for (let i = 0; i < this.filterCals.length; i++) {
                    let docRef = doc(db, "Calendar", this.filterCals[i]);
                    let docSnapshot = await getDoc(docRef);
                    let tags = docSnapshot.data().tags;
                    for (let i = 0; i < tags.length; i++) {
                        const tagRef = doc(db, "Tags", tags[i]);  // Reference to the tag document
                        const tagDoc = await getDoc(tagRef);      // Fetch the document
                        if (tagDoc.exists()) {
                            const documentData = tagDoc.data();  // Get the data of the tag document
                            const tagData = {
                                title: documentData.title,
                                completed: documentData.completed,
                                end: documentData.end,
                                start: documentData.start,
                                calendar: documentData.calendar_name,
                                color: documentData.color,
                                tag_id: tagDoc.id,  // Use the document ID
                                flagged: documentData.flagged
                            };
                            newRows.push(tagData);  // Append the tag data to the results array
                        } else {
                            console.log("Document does not exist for tag:", tags[i]);
                        }
                    }
                }
                this.tableRows = newRows; 
            }
        },

        async filterTitle() {
            let filteredRows = Array.from(this.originalRows);
            if (this.filterSettings.sortState === "none") {
                this.filterSettings.sortState = "ascending";
                filteredRows.sort((a, b) => a.title.localeCompare(b.title));
            } else if (this.filterSettings.sortState === "ascending") {
                this.filterSettings.sortState = "descending";
                filteredRows.sort((a, b) => b.title.localeCompare(a.title));
            } 
            this.tableRows = filteredRows;
        },

        async checkbutton(tag_id, completed_status) { //when synced with firestore, change to async + put in export default? under mount?
            console.log('Icon clicked!', tag_id, completed_status);
            try {
                let toggle_completed = completed_status === true ? false : true;
                const fieldToUpdate = { completed: toggle_completed };
                await updateDoc(doc(db, "Tags", tag_id), fieldToUpdate)
                console.log("current state: " + toggle_completed);

                await this.fetchAndUpdateData();
            } catch (error) {
                console.log("CAUGHT ERROR!", error);
            }
        },
        async flagbutton(tag_id, flagged_status) { //when synced with firestore, change to async + put in export default? under mount?
            console.log('Icon clicked!', tag_id, flagged_status);
            try {
                let toggle_flagged = flagged_status === true ? false : true;
                const fieldToUpdate = { flagged: toggle_flagged };
                await updateDoc(doc(db, "Tags", tag_id), fieldToUpdate)
                console.log("current state: " + toggle_flagged);

                await this.fetchAndUpdateData();
            } catch (error) {
                console.log("CAUGHT ERROR!", error);
            }
        },

        async deleteTag(tag_id) {
            const tagRef = doc(db, "Tags", tag_id);
            try {
                const tagDoc = await getDoc(tagRef);

                if (tagDoc.exists()) {
                    const tagData = tagDoc.data();
                    const calendarId = tagData.calendar_id;
                    await deleteDoc(tagRef);

                    if (calendarId) {
                        const calendarRef = doc(db, "Calendar", calendarId);
                        await updateDoc(calendarRef, {
                            tags: arrayRemove(tag_id)
                        });

                        const calDoc = await getDoc(calendarRef);
                        const calDelTags = calDoc.data().tags;
                        const calUsers = calDoc.data().users;

                        console.log("Remaining tags:", calDelTags.length, "Cal ID:", calendarId);
                
                        if (calDelTags.length === 0 && calendarId !== this.miscCal_id && calUsers.length === 1) {
                            const userRef = doc(db, "User", this.user_id);
                            await updateDoc(userRef, {
                                [`personal_calendars.${calendarId}`]: deleteField(),                                
                            });
                            await deleteDoc(calendarRef);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing deleteTag:", error);
            }
            await this.getUserCalendars();
            console.log('Successfully deleted tag and updated calendar!', tag_id);
        }, 

        async fetchAndUpdateData() {
            let tagPromises = []; 
            let miscDoc = await getDoc(doc(db, "Calendar", this.miscCal_id)); // fetch calendar doc via calendar cal_id
            let miscTags = miscDoc.data().tags;
            if (miscTags && Array.isArray(miscTags)) {
                miscTags.forEach(tagId => { 
                        let tagPromise = getDoc(doc(db, "Tags", tagId)).then(tagDoc => { // make a promise to fetch each tag via id
                            let tagData = tagDoc.data(); 
                            if (tagData) {
                                return {
                                    title: tagData.title,
                                    completed: tagData.completed,
                                    end: tagData.end,
                                    start: tagData.start,
                                    calendar: "",
                                    color: tagData.color,
                                    tag_id: tagDoc.id,
                                    flagged: tagData.flagged
                                };
                            }
                        });
                        tagPromises.push(tagPromise);
                });
            }

            for (let i = 0; i < this.cals.length; i++) {
                let calDoc = await getDoc(doc(db, "Calendar", this.cals[i]["cal_id"])); // fetch calendar doc via calendar cal_id
                let calTags = calDoc.data().tags; // get array of tag_id's of calendar
                if (calTags && Array.isArray(calTags)) { // ensure that array of tag_id's is not empty 
                    calTags.forEach(tagId => { 
                        let tagPromise = getDoc(doc(db, "Tags", tagId)).then(tagDoc => { // make a promise to fetch each tag via id
                            let tagData = tagDoc.data(); 
                            if (tagData) {
                                return {
                                    title: tagData.title,
                                    completed: tagData.completed,
                                    end: tagData.end,
                                    start: tagData.start,
                                    calendar: this.cals[i]["calendar_name"],
                                    color: tagData.color,
                                    tag_id: tagDoc.id,
                                    flagged: tagData.flagged
                                };
                            }
                        });
                        tagPromises.push(tagPromise);
                    });
                }
            }


            this.originalRows =  await Promise.all(tagPromises); // fulfill all promises at once then populate the rows 
            this.tableRows = this.originalRows;
        }
    },
}

</script>

<style scoped>

    @import '@/assets/main.css';

    .allTagsContainer{
        display: flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
    }

    #padding{
        width: 97vw;
        padding: 15px;
        border-radius:25px;
        background-color:#f5f5f5;
        max-height: 580px;
        overflow-y: auto;
        margin: auto;
    }

    table{
        background-color:#f5f5f5;
        color:#000000;
        text-align:center;
        font-family: cabin;
        width: 95vw;
        height: 580px;
        border-radius:25px;
    }


    th {
        padding: 15px;
        height: 40px;
        font-family: cabin;
        font-size: 24px;
        border-bottom: 2px solid #000000;
        position: relative;
    }


    td {
        padding: 13px;
        height: 30px;
        font-family: cabin;
        font-size: 20px;
        color: #919191;
        border-bottom: 1.5px solid #cccaca
    }

    .calendar{
        border-radius: 25px;
        color:white;
    }

    .unchecked{
        font-size: 30px;
        color: #516282;
    }

    .check{
        color: #7dab87;
        font-size: 30px;
    }

    .flagged{
        color: #bf2a2a;
    }

    .trash{
        color: #919191;
    }


    .select-category{
        background-color: #cccaca;
    }

    .filter-container {
        cursor: pointer;
        position: relative; 
        /* display: inline-block;   */
    }

    .dropdown-content {
        border-radius: 12px;

        cursor: pointer;
        position: absolute;
        background-color: #fff;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 10;
        font-family: cabin;
        font-size: medium;
        text-align: left;
        padding: 8px;
    }

    .checkbox-dropdown-content label {
        display: flex;
        padding-left: 16px;
    }

    .checkbox-dropdown-content input[type="checkbox"] {
        margin-right: 8px;
        accent-color: red;
    }

</style>
