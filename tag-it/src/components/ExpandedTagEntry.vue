<template>

    <br><br>

    <h5>Expanded Tag Entry</h5>

    <div class="expandedTEBox">
        <br><br>
        
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
                     <br>
                </div>

                <div class="labelcontainer">
                    <label for="inputDate" class="input_label">
                        <BIconCalendarDateFill /> Date
                    </label>
                    <input
                        type="date"
                        placeholder="DD/MM/YYYY"
                        id="inputDate"
                        required="no"
                    /> 
                    <br>
                </div>

                <div class="labelcontainer">
                    <label for="inputCategory" class="input_label">
                        <BIconCollectionFill /> Categories
                    </label>
                    <input
                        type="text" 
                        placeholder="Select Category"
                        id="inputCategory"
                        required="no"
                    /> 
                </div>

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

import { BIconTagsFill, BIconFlagFill, BIconCalendarDateFill, BIconCollectionFill } from 'bootstrap-icons-vue';

export default {
    components: {
        BIconTagsFill,
        BIconCalendarDateFill,
        BIconCollectionFill,
        BIconFlagFill,
    },
    methods: {
        saveEntryButton(entry) {
            console.log('saving')
            alert('saving entry, to sync with firebase')
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


    /* not sure why cannot align left :( */
    label {
        text-align: left;
        color: white;
        font-family: cabin;
        font-size: 18px
    }

    .input_label{
        left: 8%;
        margin-left: 35px;
        margin-bottom: 5px;
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

    input[type=text], input[type=date] {
        padding: 0px 5px 0px 5px;
        height: 45px;
        margin: auto;
        width: 320px;
        text-align: left;
        border-radius: 10px ;
        border-width: 1px;
        border-color: #919191;
        font-family: cabin;
        font-size: 18px;
        color: #919191;
    }

    input[type=checkbox] {
        width: 5%;
        left: 8%;
        text-align: left;
        margin-top: 10px;
        margin-left: 35px;

    }


    #selectCheckbox{
        font-size: 12px;
        font-family: cabin;
        margin-top: 10px;
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