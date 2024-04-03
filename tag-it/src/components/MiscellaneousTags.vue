<template>
    <br><br>
        <h5>MiscellaneousTags</h5>

    <div class="miscTagBox">
        <div id="topContents">
            <h3 id="miscTagHeader"> Miscellaneous Tags</h3>
            <table id = "miscTagTable">
                <tr>
                    <td @click="checkbutton"> 
                        <BIconCircle v-if="isChecked ==='unchecked'" />
                        <BIconCheckCircleFill v-else class="check"/>
                    </td>
                    <td id="task">Clean dishes</td>
                    <td @click="deletebutton"><BIconTrashFill class="trash"/></td>
                </tr>
            </table>
        </div>
        <div class="quickTagComponent" @click="addQuickTag">
            <BIconPlusCircleFill v-if="addingtag === false" class="addQuickTagButton"/>
            <QuickTagEntry v-else class="quickTagEntry"/>
        </div>
        
    </div>
</template>

<script>
import QuickTagEntry from '@/components/QuickTagEntry.vue'
import { BIconFlagFill, BIconTrashFill, BIconCircle, BIconCheckCircleFill, BIconPlusCircleFill } from 'bootstrap-icons-vue';

export default{
    components: {
        QuickTagEntry,
        BIconFlagFill,
        BIconTrashFill,
        BIconCircle,
        BIconCheckCircleFill,
        BIconPlusCircleFill,
    },
    data(){
        return {
            isChecked: 'unchecked', //set intial to unchecked, but this will be obtained from firestore
            isFlagged: 'unflagged',
            addingtag: false
        };
    },
    methods: {

        checkbutton(event) { //when synced with firestore, change to async + put in export default? under mount?
            console.log('Icon clicked!');
            console.log("current state: " + this.isChecked);
            this.isChecked = this.isChecked === 'checked' ? 'unchecked' : 'checked';
        },
        flagbutton(event) { //when synced with firestore, change to async + put in export default? under mount?
            console.log('Icon clicked!');
            console.log("current state: " + this.isFlagged);
            this.isFlagged = this.isFlagged === 'flagged' ? 'unflagged' : 'flagged';
        },
        deletebutton(event) {
            console.log('deleting tag');
            alert('deleting tag: to clear from the db')
        },
        addQuickTag(event) {
            // do we need a cancllation button - or will it auto cancel itself
            console.log('Add Quick Tag');
            this.addingtag = true;
        }
    }
}

</script>


<style scoped>

    @import '@/assets/main.css';

    .miscTagBox {
        background-color: #f5f5f5;
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

    /* .quickTagComponent{
        text-align: center;
        padding: 15px;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    } */

    .quickTagEntry{
        text-align: center;
        padding: 15px;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }

    .addQuickTagButton{
        color:#a0b6db;
        font-size: 55px;
        text-shadow: #788db0;
        text-align: center;
        padding: 15px;
        bottom: 0;
        right: 0;
        position: absolute;
    }


    #miscTagHeader {
        padding: 30px;
        font-size: 30px;
        letter-spacing: 2px;
        /* font-family: Montserrat; */
        color: white;
        background-color: #a0b6db;
        border-radius: 20px 20px 0px 0px;
    }

    table{
        background-color:#f5f5f5;
        color:#a0b6db;
        text-align:center;
        font-family: cabin;
        width: 90%;
        margin: auto;
        border-spacing: 0;
        border:0.5px solid #f5f5f5;
        border-radius:25px;
        padding: 10px;
        /* need something to fix the height of the table */
    }

    td{
        padding: 0px 0px 10px 0px;
        height: 30px;
        font-family: cabin;
        border-bottom: 1px solid #a0b6db;
        text-align: left;
        color: #6c7a94;
    }

    /* .flagged{
        color: #bf2a2a;
    } */

    .trash{
        color: #919191;
    }

</style>