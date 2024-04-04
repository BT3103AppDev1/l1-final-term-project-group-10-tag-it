<template>

    <br><br>

    <h5>Expanded Tag Entry</h5>
    <p> changing the category description </p>

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

                <div class="labelcontainer">
                    <label for="inputCategory" class="input_label">
                        <BIconCollectionFill /> Categories
                    </label>
                    <!--should this be a drop down?-->
                    <input
                        type="text" 
                        placeholder="Select Category"
                        id="inputCategory"
                        required="no"
                    /> 
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

import { BIconTagsFill, BIconFlagFill, BIconCalendarDateFill, BIconCollectionFill, BIconXLg } from 'bootstrap-icons-vue';
import { deleteAllPersistentCacheIndexes } from 'firebase/firestore';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
    components: {
        BIconTagsFill,
        BIconCalendarDateFill,
        BIconCollectionFill,
        BIconFlagFill,
        BIconXLg,
    },
    data() {
        return {
            flagged: false //initialise to false
        }
    },
    methods: {
        updateFlagged() {
            this.flagged = this.flagged === false? true: false;
        },

        async saveEntryButton() {
            console.log('saving')
            
            //maybe can generate a unique id instead?
            let docId = document.getElementById("inputTagName").value; 
            let docTitle = document.getElementById("inputTagName").value;
            let docStart = document.getElementById("inputStartDate").value.replace('T', ' ');
            let docEnd = document.getElementById("inputEndDate").value.replace('T', ' ');
            let docCategory = document.getElementById("inputCategory").value;
            let docCompleted = false;
            

            //have not synced specific tag to user
            try {
                alert('saving entry to database')
                const docRef = await setDoc(doc(db, "Tags", docId),{
                    id: docId,
                    title: docTitle,
                    start: docStart,
                    end: docEnd,
                    class: docCategory,
                    completed: docCompleted,
                    flagged: this.flagged,
                })
                console.log(docRef);
                document.getElementById("expandedTEForm").reset();
                this.$emit("added")
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

    .labelcontainer{
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

    textarea {
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