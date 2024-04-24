<template>
    <div class="bento">
        <div class="gridContainer">
            <div id="top-left" class="bentoCurvedRectangle">
                <div><WelcomeCard /></div>
            </div>
            <div id="top-right">
                <FourMetrics />
            </div>
        </div>
        <ProgressBar />
    </div>
</template>

<script>
import WelcomeCard from "@/components/WelcomeCard.vue";
import FourMetrics from "@/components/FourMetrics.vue";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
    name: "Bento",

    components: {
        WelcomeCard,
        FourMetrics,
        ProgressBar,
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
    max-height: 65vh;
}

.gridContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr;
    /* grid-template-rows: 4fr 6fr; */
    /* height: 65vh; */
    gap: 1rem;
    box-sizing: border-box;
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

#bottom-left {
    max-height: 50vh;
    max-width: 100%;
    display: grid;
    padding: 30px;
    clear: both;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
}

#bottom-right {
    clear: both;
    padding: 30px;
    display: grid;
    overflow-y: hidden;
    position: relative;
}
</style>
