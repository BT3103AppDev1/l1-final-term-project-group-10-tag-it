<template>
    <div class="quickAddTag">
        <form class="quickAddTagForm">
            <input
                type="text"
                placeholder="Quick add tag..."
                id="quickAddTag"
                required="yes"
            >
            <!-- not sure how to put icon over form -->
            <i class="expandTag" @click="expandTagEntry"> <BIconArrowsAngleExpand /></i>
        </form>
    </div>

</template>

<script>

import { BIconArrowsAngleExpand } from 'bootstrap-icons-vue';

export default{
    components:{
        BIconArrowsAngleExpand,
    },
    props:{
        icon: BIconArrowsAngleExpand,
    },
    methods:{
        expandTagEntry(event){
            console.log("expanding tag")
            alert("expand button works, will need to route to expanded tag entry")
        }
    }
}

</script>

<style scoped>

    @import '@/assets/main.css';

    .quickAddTag{
        font-family: cabin;
        font-size: 18px;
    }

    .quickAddTagForm i{
        position: absolute;
        top: 50%;
        right: 8%;
        transform: translateY(-50%);
        pointer-events: auto;
    }

    input{
        border-radius:25px;
        border-color: #a0b6db;
        background-color:#a0b6db;
        width: 340px;
        height: 52px;
        /* text-align: left; */
        border-width:1px;
        padding: 0px 10px 0px 10px
    }

</style>