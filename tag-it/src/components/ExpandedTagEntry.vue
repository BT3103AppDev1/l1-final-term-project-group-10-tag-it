<template>

    <br><br>

    <h5>Expanded Tag Entry</h5>

    <div class="expandedTEBox">
        <br>
        <BIconXLg class="cross" @click="closeExpandedTEBox" />
        
            <form class="expandedTEForm">
                <div class="labelcontainer">
                    <label for="inputTagname" class="input_label">
                        <BIconTagsFill /> Name of Tag
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        id="inputTagname"
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

export default {
    components: {
        BIconTagsFill,
        BIconCalendarDateFill,
        BIconCollectionFill,
        BIconFlagFill,
        BIconXLg,
    },
    methods: {
        saveEntryButton(entry) {
            console.log('saving')
            alert('saving entry, to sync with firebase')
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

    .cross{
        color: white;
        font-size: 25px;
        right: 25px;
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
        margin-left: 35px;
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
        height: 45px;
        width: 320px;
        text-align: left;
        border-radius: 10px ;
        border-width: 1px;
        border-color: #919191;
        font-family: cabin;
        font-size: 13px;
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
        margin-left: 35px;

    }


    #selectCheckbox{
        font-size: 12px;
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
        bottom: 5%;
        right: 10%;
    }

    .flagged{
        color:#bf2a2a;
    }

</style>