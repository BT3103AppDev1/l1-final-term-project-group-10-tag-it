<template>
    <h5> ALL TASK LIST</h5>
    <p> reordering of the tasks? yet to enable filter. set specific colors for the specific categories</p>
    <p> also are we able to edit the tags from here?</p>
    <p>this version doesnt use tag_id but the auto_generated id of the tag</p>
    <div class="allTagsContainer">
        
        <div id="padding">
        <!-- <BIconFunnelFill class="filterIcon" @click="filter" /> -->
        <table id = "AllTagsTable" class = "auto-index">
            <tr>
                <th></th>
                
                <th><div class="filter-container">TITLE
                    <i @click="filterTitle">
                        <BIconSortAlphaDown v-if="this.buttonOptions.title"/>
                        <BIconSortAlphaDownAlt v-if="this.buttonOptions.TitleDsc" />
                        <BIconSortAlphaDown v-if="this.buttonOptions.TitleAsc" /> 
                    </i> 
                    </div></th>
                <th><div class="filter-container">CALENDAR
                        <BIconArrowBarDown class="filterbutton" @click="filter"/> 
                        <div v-if="active">
                            <div class="dropdown-content">
                                <div class="opt-labels" v-for="(opt, index) in cals" :key="opt.cal_id">
                                    <input 
                                    type="checkbox" 
                                    :value="opt.cal_id" 
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
import firebaseApp from '../firebase.js';
import { ref } from 'vue';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default{
    // setup() {
    //     const checkedCal = ref([]);
    //     return {
    //         checkedCal  
    //     };
    // },
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
            cals: [],
            filterCals: [],
            active: false,
            filterSettings : {
                filterStartDate: false,
                filterEndDate: false,
                filterTitleAsc: false,
                filterTitleDsc: false,
                filterImpt: false,
                filterCal: false,
            },
            filterConditions: {
                importance: false,
                startDate: false,
                endDate: false,
                titleAsc: false,
                titleDsc: false,

            },
            buttonOptions: {
                TitleAsc: false,
                TitleDsc: false,
                title: true,
            },
        };
    },

    methods: {
        async filter() {
            this.active = !this.active;
        },

        async filterStartDate() {
            this.filterSettings.filterStartDate = !this.filterSettings.filterStartDate;
            if (this.filterSettings.filterStartDate) {
                this.filterConditions.startDate = true;
                this.applyFilters();
            } else { // reset
                // this.buttonOptions.startDateBtn = !this.buttonOptions.startDateBtn;
                this.filterConditions.startDate = false;
                this.applyFilters();
            }
        },

        async filterEndDate() {
            this.filterSettings.filterEndDate = !this.filterSettings.filterEndDate;
            if (this.filterSettings.filterEndDate) {
                this.filterConditions.endDate = true;
                this.applyFilters();
            } else { // reset
                this.filterConditions.endDate = false;
                this.applyFilters();
            }
        },

        async filterImpt() {
            this.filterSettings.filterImpt = !this.filterSettings.filterImpt;
            this.filterConditions.importance = !this.filterConditions.importance;
            this.applyFilters();
        },

        async fetchCal() {
            let allDocuments = await getDocs(collection(db, "Calendar"))
            this.cals = await Promise.all(
                allDocuments.docs.map(async (doc) => {
                    let documentData = doc.data();
                    let calendar_name = documentData.calendar_name;
                    let cal_id = doc.id;
                    return {
                        calendar_name,
                        cal_id,
                    };
                })
            );
        },

        async getCal(event, cal_id) {
            const isChecked = event.target.checked;
            if (isChecked) {
                this.filterCals.push(cal_id);
                this.loadCals();
                // if (docSnapshot.exists()) {
                //     console.log("Document data:", docSnapshot.data().tags);
                // } else {
                //     console.log("No 3such document!");
                // }
            } else {
                this.filterCals = this.filterCals.filter(item => item !== cal_id);
                console.log("this is removed",cal_id);
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
            if (!this.filterSettings.filterTitleAsc && !this.filterSettings.filterTitleDsc) {
                this.buttonOptions.TitleDsc = false;
                this.buttonOptions.TitleAsc = true;
                this.buttonOptions.title = false;

                this.filterSettings.filterTitleAsc = true;
                this.filterConditions.titleAsc = true;
                this.applyFilters();
            }
            else if (this.filterSettings.filterTitleAsc && !this.filterSettings.filterTitleDsc) {
                this.buttonOptions.TitleDsc = true;
                this.buttonOptions.TitleAsc = false;
                this.buttonOptions.title = false;

                this.filterSettings.filterTitleDsc = true;
                this.filterSettings.filterTitleAsc = false;
                this.filterConditions.titleDsc = true;
                this.applyFilters();
            } else {
                this.buttonOptions.TitleDsc = false;
                this.buttonOptions.TitleAsc = false;
                this.buttonOptions.title = true;

                this.filterSettings.filterTitleDsc = false;
                this.filterSettings.filterTitleAsc = false;
                this.buttonOptions.title = true;
                this.applyFilters();
            }
        },

        async applyFilters() {
            let allDocuments = await getDocs(collection(db, "Tags"));
            this.tableRows = await Promise.all(
                allDocuments.docs.map(async (doc) => {
                    let documentData = doc.data();
                    let title = documentData.title;
                    let completed = documentData.completed;
                    let end = documentData.end;
                    let start = documentData.start;
                    let calendar = documentData.calendar_name;
                    let color = documentData.color;
                    // let id = documentData.id;
                    let tag_id = doc.id;
                    let flagged = documentData.flagged;
                    
                    return {
                        title,
                        completed,
                        end,
                        start,
                        calendar,
                        color,
                        tag_id,
                        flagged
                    };
                })
            );
            let filteredRows = this.tableRows;

            if (this.filterConditions.importance) {
                filteredRows = filteredRows.filter(row => row.flagged);
            }
            if (this.filterConditions.startDate) {
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
            if (this.filterConditions.endDate) {
                filteredRows = filteredRows.sort((a, b) => {
                    const dA = new Date(a.end);
                    const dB = new Date(b.end);
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

            if (this.filterConditions.titleAsc) {
                filteredRows = filteredRows.sort((a, b) => a.title.localeCompare(b.title));
                this.filterConditions.titleAsc = false;
            }

            if (this.filterConditions.titleDsc) {
                filteredRows = filteredRows.sort((a, b) => b.title.localeCompare(a.title));
                this.filterConditions.titleDsc = false;
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
            alert("You are going to delete: " + tag_id);
            await deleteDoc(doc(db, "Tags", tag_id))

            await this.fetchAndUpdateData();
            console.log('sucessfullly deleted!', tag_id)
            
        }, 
        async fetchAndUpdateData() {
            let allDocuments = await getDocs(collection(db, "Tags"))

            this.tableRows = await Promise.all(
                allDocuments.docs.map(async (doc) => {
                    let documentData = doc.data();
                    let title = documentData.title;
                    let completed = documentData.completed;
                    let end = documentData.end;
                    let start = documentData.start;
                    let calendar = documentData.calendar_name;
                    let color = documentData.color;
                    //let id = documentData.id;
                    let tag_id = doc.id;
                    let flagged = documentData.flagged;
                    
                    return {
                        title,
                        completed,
                        end,
                        start,
                        calendar,
                        color,
                        tag_id,
                        flagged
                    };
                })
            );
        },

    },
    async mounted() {
        this.fetchAndUpdateData(); //add authentication
        this.fetchCal();
    }
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


    th{
        padding: 15px;
        height: 40px;
        font-family: cabin;
        font-size: 24px;
        border-bottom: 2px solid #000000;
        position: relative;
    }


    td{
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