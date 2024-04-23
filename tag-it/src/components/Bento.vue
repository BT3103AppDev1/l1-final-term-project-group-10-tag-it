<template>
    <div class="bento">
        <div class="gridContainer">
            <div id="top-left" class="bentoCurvedRectangle">
                <div><WelcomeCard /></div>
            </div>
            <div id="top-right">
                <FourMetrics />
            </div>
            <div id="bottom-left" class="bentoCurvedRectangle">
                <Graph1 />
            </div>
            <div id="bottom-right" class="bentoCurvedRectangle">
                <Graph2 />
            </div>
        </div>
    </div>
</template>

<script>
import WelcomeCard from "@/components/WelcomeCard.vue";
import FourMetrics from "@/components/FourMetrics.vue";
import Graph1 from "@/components/Graph1.vue";
import Graph2 from "@/components/Graph2.vue";

export default {
    name: "Bento",

    components: {
        WelcomeCard,
        FourMetrics,
        Graph1,
        Graph2,
    },
};
</script>

<style>
.bento {
    width: 90%;
    min-width: 0;
    max-width: 90%;
    align-items: center;
    vertical-align: middle;
    margin: auto;
    /* height: auto; */
}

.gridContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 4fr 6fr;
    height: 65vh;
    gap: 1rem;
    box-sizing: border-box;
    /* padding: 20px; */
    /* max-height: 100vh; */
}

.bentoCurvedRectangle {
    background-color: #f2f2f2;
    color: #686868;
    filter: drop-shadow(2px 2px #919191);

    padding: 15px;

    border-radius: 15px;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
    display: flex;
}

/* #top-left {
    max-width: 40px;
} */

#bottom-left {
    max-height: 50vh;
    max-width: 100%;
    display: grid;
    padding: 30px;
    clear: both;
    /* display: block; */
    align-items: center;
    vertical-align: middle;
    justify-content: center;
}

#bottom-right {
    clear: both;
    padding: 30px;
    display: grid;
    /* display: block; */
    overflow-y: hidden;
    position: relative;
    /* white-space: nowrap; */
}
</style>
