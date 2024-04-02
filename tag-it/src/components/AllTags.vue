<template>
    <h5> ALL TASK LIST</h5>
    <p> reordering of the tasks? yet to enable filter. set specific colors for the specific categories</p>
    <p> also are we able to edit the tags from here?</p>
    <div class="allTagsContainer">
        
        <div id="padding">
        <table id = "table" class = "auto-index">
            <tr>
                <th></th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>START</th>
                <th>END</th>
                <th></th>
                <th><i @click="filter"><BIconFunnelFill /></i></th> 
                <!--need to add a filer-->
            </tr>

            <tr v-for="(row,index) in tableRows" :key="row.id">
                <td><i @click="checkbutton(row.id, row.completed)"> 
                    <BIconCircle v-if="!row.completed" class="unchecked" />
                    <BIconCheckCircleFill v-else class="check"/>
                </i></td>
                <td> {{ row.title }}</td>
                <td id="category">
                    {{ row.category }}
                    <!--colour should change based on the category -->
                    <!--also need to obtain the categories from the firestore pump and into inputs-->
                    <!-- <label for="category"></label>
                    <select name="category" id="category"> 
                        
                        <option value="select category" class="select-category" >Select Category</option> 
                    </select> -->
                </td>
                <td>{{ row.end }}</td>
                <td>{{ row.start }}</td>
                <td> <i @click="flagbutton(row.id, row.flagged)">
                    <BIconFlag v-if="!row.flagged" />
                    <BIconFlagFill v-else class="flagged" />
                    </i>
                </td>
                <td><i class="trash" @click="deleteTag(row.id)"><BIconTrashFill /></i></td>

            </tr>


            <!--the following are just placeholders for the data-->
            <!-- need to obtain this whole list from firestore, iterate though the list -->
            <!-- <tr>
                <td><i @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </i></td>
                <td>Lunch with Alvern</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" class="select-category" >Select Category</option> 
                        <option value="personal" class="personal">Personal</option>
                        <option value="work" class="work">Work</option>
                        <option value="bt3103 group" class="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>05/07/2024</td> 
                <td> <i @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                    </i>
                </td>
                <td><i class="trash" @click="deleteTag"><BIconTrashFill /></i></td> 
            </tr> -->

            <br>
        </table> </div>
    </div> 

</template>

<script>

import { BIconFlag, BIconFlagFill, BIconTrashFill, BIconCircle, BIconCheckCircleFill, BIconFunnelFill } from 'bootstrap-icons-vue';
import firebaseApp from '../firebase.js';
import { getFirestore, updateDoc } from 'firebase/firestore';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export default{
    components: {
        BIconFlag,
        BIconFlagFill,
        BIconTrashFill,
        BIconCircle,
        BIconCheckCircleFill,
        BIconFunnelFill,
    },
    data(){
        return {
            tableRows: [],
        };
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
        },

    },
    async mounted() {
        this.fetchAndUpdateData(); //add authentication
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

</style>