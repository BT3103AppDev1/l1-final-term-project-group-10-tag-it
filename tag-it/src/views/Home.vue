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
<<<<<<< HEAD
<style></style>
=======

<style scoped>

.texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
}
.welcome-msg {
    color: #fff;
    font-size: 7vh;
    margin-top: 30px;
    margin-bottom: 40px;
}

.tags-msg {
    color: #000;
    font-size: 7vh;
}

.full-page-bg {
  height: 100vh; /* make sure it covers the full viewport height */
  /* background-color: #343a40;  */
  background-image: linear-gradient(#fff, #0A42AD);
} 
</style>
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
