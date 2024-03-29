<template>
    this is home page
    <AllTags />
</template>
<script>
// ===== LOGIC =====
// if loggedin -> show dashboard
// if NOT loggedin -> show login

import AllTags from "@/components/AllTags.vue";
export default {
    name: "Home",
    components: { AllTags },
};
</script>
<style></style>
