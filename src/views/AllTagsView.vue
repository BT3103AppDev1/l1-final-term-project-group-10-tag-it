<script>
import AllTagsComp from "@/components/AllTags.vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";

export default {
    name: "AllTagsView",
    components: {
        AllTagsComp,
        Footer,
        Navbar,
    },
};
</script>

<template>
    <Navbar />
    <router-view />
    <AllTagsComp />
    <Footer />
</template>


