<template>
    <br /><br />
    <h5>ALL TASK LIST</h5>
    <p>
        need to figure out how to set specific colors for the specific
        categories, delete button, need to sync to firestore
    </p>

    <div class="container">
        <table id="table" class="auto-index">
            <tr>
                <th></th>
                <!-- check box-->
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th></th>
                <!-- flag -->
                <th></th>
                <!-- delete -->
            </tr>

            <!--the following are just placeholders for the data-->

            <!-- need to obtain this whole list from firestore, iterate though the list -->
            <tr>
                <td @click="checkbutton">
                    <BIconCircle v-if="isChecked === 'unchecked'" />
                    <BIconCheckCircleFill v-else class="check" />
                </td>
                <td>Lunch with Alvern</td>
                <td>
                    <label for="category"></label>
                    <select name="category" id="category">
                        <!--colour should change based on the category -->
                        <!--also need to obtain the categories from the firestore-->
                        <option value="select category" class="select-category">
                            Select Category
                        </option>
                        <option value="personal" class="personal">
                            Personal
                        </option>
                        <option value="work" class="work">Work</option>
                        <option value="bt3103 group" class="bt3103">
                            BT3103 Grroup
                        </option>
                    </select>
                </td>
                <td>05/07/2024</td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged === 'unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash" /></td>
            </tr>

            <!--

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td> 
                <td>Group Project</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>14/07/2024</td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td>
                <td>BT3103 Group Meeting</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>20/07/2024</td> 
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td>
                <td>Go to Gym</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>22/08/2024</td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td>
                <td>Dinner with Justin</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>17/07/2024</td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td>  
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td>
                <td>Buy cat food</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td></td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td>
                <td>Practice leetcode</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td></td>
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td @click="checkbutton"> 
                    <BIconCircle v-if="isChecked ==='unchecked'" />
                    <BIconCheckCircleFill v-else class="check"/>
                </td> 
                <td>Prepare for interview</td>  
                <td><label for="category"></label>
                    <select name="category" id="category">
                        <option value="select category" id="select category">Select Category</option>
                        <option value="personal" id="personal">Personal</option>
                        <option value="work" id="work">Work</option>
                        <option value="bt3103 group" id="bt3103">BT3103 Grroup</option>
                    </select>
                </td>   
                <td>09/08/2024</td> 
                <td @click="flagbutton">
                    <BIconFlag v-if="isFlagged==='unflagged'" />
                    <BIconFlagFill v-else class="flagged" />
                </td>
                <td><BIconTrashFill class="trash"/></td> 
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            -->
        </table>
        <br /><br />
    </div>

    <LogOut />
    <!-- remove these lines -->
</template>

<script>
import {
    BIconFlag,
    BIconFlagFill,
    BIconTrashFill,
    BIconCircle,
    BIconCheckCircleFill,
} from "bootstrap-icons-vue";
import LogOut from "./LogOut.vue";

export default {
    components: {
        BIconFlag,
        BIconFlagFill,
        BIconTrashFill,
        BIconCircle,
        BIconCheckCircleFill,
        LogOut,
    },
    data() {
        return {
            isChecked: "unchecked", //set intial to unchecked, but this will be obtained from firestore
            isFlagged: "unflagged",
        };
    },
    methods: {
        checkbutton(event) {
            //when synced with firestore, change to async + put in export default? under mount?
            console.log("Icon clicked!");
            console.log("current state: " + this.isChecked);
            this.isChecked =
                this.isChecked === "checked" ? "unchecked" : "checked";
        },
        flagbutton(event) {
            //when synced with firestore, change to async + put in export default? under mount?
            console.log("Icon clicked!");
            console.log("current state: " + this.isFlagged);
            this.isFlagged =
                this.isFlagged === "flagged" ? "unflagged" : "flagged";
        },
    },
};
</script>

<style>
@import "@/assets/main.css";

table {
    background-color: #f5f5f5;
    color: #000000;
    text-align: center;
    font-family: cabin;
    width: 90%;
    margin: auto;
    border-spacing: 0;
    border: 0.5px solid #f5f5f5;
    border-radius: 25px;
    padding: 8px;
    /* need something to fix the height of the table */
}

th {
    padding: 10px;
    font-family: cabin;
    border-bottom: 1px solid #000000;
}

td {
    padding: 8px;
    height: 30px;
    font-family: cabin;
    border-bottom: 1px solid #2e2e2e;
}

.flagged {
    color: #bf2a2a;
}

.trash {
    color: #919191;
}

select option[value="personal"] {
    background: #e67c7c;
}

select option[value="work"] {
    background: #7dab87;
}

select option[value="bt3103 group"] {
    background: #6d86b5;
}

/* select option[value="select category"]{
        background: #cccaca;
    } */

.select-category {
    background-color: #cccaca;
}
</style>
