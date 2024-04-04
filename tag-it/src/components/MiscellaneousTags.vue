<template>
    <br><br>
        <h5>MiscellaneousTags</h5>

    <div class="miscTagBox">
        <div id="topContents">
            <h3 id="miscTagHeader"> Miscellaneous Tags</h3>
            <div class="tableDiv">
            <table id = "miscTagTable">
                <tr v-for="(row,index) in tableRows" :key="row.id">
                    <td><i @click="checkbutton(row.id, row.completed)"> 
                        <BIconCircle v-if="!row.completed" class="unchecked" />
                        <BIconCheckCircleFill v-else class="check"/>
                    </i></td>
                    <td> {{ row.title }}</td>
                    <td><i class="trash" @click="deleteTag(row.id)"><BIconTrashFill /></i></td>
                </tr>
                    
            </table></div>
        </div>
        <div class="quickTagComponent" @click="addQuickTag">
            <BIconPlusCircleFill v-if="addingtag === false" class="addQuickTagButton"/>
            <QuickTagEntry v-else class="quickTagEntry"/>
        </div>
        
    </div>

    <br><br>

</template>

<script>
import QuickTagEntry from '@/components/QuickTagEntry.vue'
import { BIconFlagFill, BIconTrashFill, BIconCircle, BIconCheckCircleFill, BIconPlusCircleFill } from 'bootstrap-icons-vue';
import firebaseApp from '../firebase.js';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(firebaseApp);

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
            tableRows: [],
            addingtag: false 
        };
    },
    async mounted() {
        this.fetchAndUpdateData(); //add authentication
    },
    methods: {

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
                    let category = documentData.class;
                    let id = documentData.id;
                    let flagged = documentData.flagged;
                    

                        return {
                            title,
                            completed,
                            end,
                            start,
                            category,
                            id,
                            flagged
                        };
                })
            );
            //filter for those that have no category 
            this.tableRows = this.tableRows.filter(row => !row.category);
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

    .tableDiv{
        overflow-y: auto;
        max-height: 335px;
    }

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
        font-size: 80px;
        text-shadow: #788db0;
        text-align: center;
        padding: 15px;
        bottom: 0;
        right: 15px;
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

    .unchecked{
        color: #516282;
        font-size: 30px;
    }

    .check{
        color: #7dab87;
        font-size: 30px;
    }

    .trash{
        color: #919191;
    }

</style>