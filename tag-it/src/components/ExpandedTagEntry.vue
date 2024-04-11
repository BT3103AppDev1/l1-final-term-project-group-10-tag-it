<template>

    <br><br>

    <h5>Expanded Tag Entry</h5>
    <p> changing the calendar description </p>

    <div class="expandedTEBox">
        <br>
        <BIconXLg class="cross" @click="closeExpandedTEBox" />
        
            <form class="expandedTEForm" id="expandedTEForm">
                <div class="labelcontainer">
                    <label for="inputTagName" class="input_label">
                        <BIconTagsFill /> Name of Tag
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        id="inputTagName"
                        required="yes"
                    /> 
                </div>

                <div class="labelcontainer">
                    <label for="inputStartDate" class="input_label">
                        <BIconCalendarDateFill /> Start Date
                    </label>
                    <!--DDMMYYYYTHHMM need to replace T with " "-->
                    <input
                        type="datetime-local"           
                        placeholder="DD/MM/YYYY"
                        id="inputStartDate"
                        required="no"
                    /> 
                </div>

                <div class="labelcontainer">
                    <label for="inputEndDate" class="input_label">
                        <BIconCalendarDateFill /> End Date
                    </label>
                    <!--DDMMYYYYTHHMM need to replace T with " "-->
                    <input
                        type="datetime-local"           
                        placeholder="DD/MM/YYYY"
                        id="inputEndDate"
                        required="no"
                    /> 
                </div>


                <!-- DATA VALIDATION: CANNOT HAVE SAME CALENDAR NAME -->

                <div class="calendarContainer">
                    <label for="selectInputCalendarName" class="input_label">
                        <BIconCollectionFill /> Calendar
                    </label>
                    <input
                        type="text" 
                        placeholder="Select Calendar"
                        id="selectInputCalendarName"
                        v-model="cal_name"
                        list="categories"
                        required="no"
                    />
                        
                    <datalist id="categories">
                        <option v-for="(cal_color, cal_name) in calName_calColor" :value="cal_name">{{ cal_name }}</option>
                    </datalist>
                    <div class="CalendarColors">
                        <input 
                            v-if="calName_calColor[cal_name]"
                            type="color"
                            id="customColor"
                            :style="{color: calName_calColor[cal_name]}"
                            v-model="calName_calColor[cal_name]"
                            disabled
                        >
                        <input
                            v-else
                            type="color"
                            id="customColor"
                            value="#cccaca"
                        />
                    </div>     
                </div>

                <!-- <div class="labelcontainer">
                    <label for="inputDescription" class="input_label">
                        <BIconCollectionFill /> Description
                    </label>
                    <textarea
                        type="text" 
                        id="inputDescription"
                        required="no"
                    ></textarea> 
                </div> -->

                <div class="checkboxcontainer">
                    <input
                        type="checkbox"
                        id="selectCheckbox"
                        required="no" 
                        @change="updateFlagged"
                    />
                    <label for="selectCheckbox" id="selectCheckbox">
                        Mark as important <BIconFlagFill class="flagged"/>
                    </label>
                </div>

                    <button
                        id="saveEntryButton"
                        type="button"
                        v-on:click="saveEntryButton"
                    >
                    SAVE
                    </button> <br><br>
                    
                
                </form>

    </div>

    
</template>

<script>

import { BIconTagsFill, BIconFlagFill, BIconCalendarDateFill, BIconCollectionFill, BIconXLg, BIconTriangleFill, BIconCircleFill } from 'bootstrap-icons-vue';
import { arrayUnion, deleteAllPersistentCacheIndexes } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, addDoc, setDoc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
    components: {
        BIconTagsFill,
        BIconCalendarDateFill,
        BIconCollectionFill,
        BIconFlagFill,
        BIconXLg,
        BIconTriangleFill,
        BIconCircleFill,
    },
    data() {
        return {
            flagged: false, //initialise to false
            //cal_id: '',
            cal_name: '',
            cal_color: '',
            calName_calColor: {}, //populate with data from firebase
            calName_calId:{}
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        updateFlagged() {
            this.flagged = this.flagged === false? true: false;
        },

        async fetchData(){
            // need to get specific calendars of the users
            let allDocuments = await getDocs(collection(db, "Calendar"));
            await Promise.all(
                allDocuments.docs.map(async (doc) => {
                    let documentData = doc.data();
                    let cal_id = doc.id;
                    let cal_name = documentData.calendar_name;
                    let cal_color = documentData.color;
        
                    //setting up the dictionary of category to their specific colors
                    this.calName_calColor[cal_name] = cal_color;
                    this.calName_calId[cal_name] = cal_id;
                    
                })
            )

        },

        async saveEntryButton() {
            console.log('saving')
            
            let docTitle = document.getElementById("inputTagName").value;
            let docStart = document.getElementById("inputStartDate").value.replace('T', ' ');
            let docEnd = document.getElementById("inputEndDate").value.replace('T', ' ');
            let docCalendar_name = document.getElementById("selectInputCalendarName").value;
            //add calendar id later on
            let docColor = document.getElementById("customColor").value;
            let docCompleted = false;
            

            //have not synced specific tag to user
            try {
                alert('saving entry to database')

                //create a new tag
                //const docRef = await setDoc(doc(db, "Tags", docId),{
                const tagDocRef = await addDoc(collection(db, "Tags"),{
                    //id: docId,
                    title: docTitle,
                    start: docStart,
                    end: docEnd,
                    calendar_name: docCalendar_name,
                    color: docColor,
                    completed: docCompleted,
                    flagged: this.flagged,
                })

                const tag_id = tagDocRef.id
                let cal_id = ''
                //if there user set a calendar, create/update calendar
                if (docCalendar_name != "") {
                    // add tag to calendar
                    console.log("adding to calendar: " + this.cal_name)
                    
                    
                    //* assuming no repetition of calendar names
                    if (this.cal_name in this.calName_calId) {
                        //if calendar already exists, get the current calendar_id
                        cal_id = this.calName_calId[this.cal_name]

                        const calDocExistRef = doc(db, "Calendar", cal_id)
                        //const calDoc = await getDoc(calDocRef)

                        console.log("updating: " + docCalendar_name)
                        // add tag_id to tag array
                        await updateDoc(calDocExistRef, {
                            tags: arrayUnion(tag_id)
                        })


                    } else {
                        //if calendar does not exist, add to users . 
                        console.log("creating a new calendar: " + docCalendar_name)
                        
                        //create a new calendar
                        const calDocNewRef = await addDoc(collection(db, 'Calendar'), {
                            calendar_name: docCalendar_name,
                            color: docColor,
                            tags: [tag_id]
                            //users:[] add current userid in
                        })
                        
                        //(update in current user)

                        //get id of new calendar
                        cal_id = calDocNewRef.id
                        
                    }
                }
                await updateDoc(tagDocRef, {
                        calendar_id: cal_id
                })

                //if no calendar stated, add tagid to user?


                console.log(tagDocRef);
                document.getElementById("expandedTEForm").reset();
                this.$emit("added")
                mounted()
            } catch(error) {
                console.error("Error adding document: ", error);
            }

            //after save reroute to misc tags
        },

        closeExpandedTEBox(event){
            console.log('close expanded tag entry box')
            alert('contents will not be saved. Continue?')
            //reroute to miscellaneous tags page
        }
    }

}

</script>

<style scoped>

    @import '@/assets/main.css';

    .expandedTEBox {
        background-color: #a0b6db;
        width: 390px;
        height: 520px;
        border-radius: 20px;
        border-width: 1px;
        border-color: #919191;
        margin: auto;
        font-family: cabin;
        font-size: 18px;
        position: relative;
    }

    .expandedTEForm{
        top: 40px;
        bottom: 40px;
        left: 35px;
        right: 35px;
        position: absolute;
    }

    .cross{
        color: white;
        font-size: 25px;
        right: 20px;
        top: 20px;
        position: absolute;
    }


    /* not sure why cannot align left :( */
    label {
        text-align: left;
        color: white;
        font-family: cabin;
        font-size: 16px
    }

    .input_label{
        left: 8%;
        margin-bottom: 1px;
        margin-right: 10px;
        text-align: left;
    }

    .labelcontainer, .calendarContainer{
        display:flex;
        flex-direction: column;
    }

    .checkboxcontainer{
        display:flex;
    }

    input[type=text], input[type=datetime-local] {
        padding: 0px 5px 0px 5px;
        height: 43px;
        width: 320px;
        text-align: left;
        border-radius: 10px ;
        border-width: 1px;
        border-color: #919191;
        font-family: cabin;
        font-size: 14px;
        color: #919191;
        margin: auto;
        margin-bottom: 5px;
    }

    /* textarea {
        padding: 0px 5px 0px 5px;
        height: 60px;
        width: 320px;
        min-height: 60px;
        max-height: 120px;
        text-align: left;
        border-radius: 10px ;
        border-width: 1px;
        border-color: #919191;
        font-family: cabin;
        font-size: 13px;
        color: #919191;
        margin: auto;
        margin-bottom: 3px;
    } */

    input[type='color'] {
        position: absolute;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 265px;
        right: 10px;
        transform: translateY(-50%);
        pointer-events: auto;
    }


    input[type=checkbox] {
        width: 5%;
        left: 8%;
        text-align: left;
        margin-top: 5px;
    }


    #selectCheckbox{
        font-size: 10px;
        font-family: cabin;
        margin-top: 5px;
    }

    button{
        text-align: right;
        font-family: cabin;
        font-size: 18px;
        color: #7d7d7d;
        text-align: center;
        border-radius: 5px;
        border-width: 2px;
        border-color: #919191;
        width: 80px;
        padding: 5px;
        position: absolute;
        bottom: 0px;
        right: 0px;
    }

    .flagged{
        color:#bf2a2a;
    }

</style>