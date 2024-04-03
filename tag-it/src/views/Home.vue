<template>
    <div>
        <!-- <Navbar /> -->
        <div class="full-page-bg">
            <div class="texts">
                <h1 class="welcome-msg">
                    Welcome {{ username }}!
                    <!-- name will be accessed from the database -->
                </h1>
                <h1 class="tags-msg">
                    Your have 4 Tags today!
                    <!-- number of Tags will be accessed from the database -->
                </h1>
            </div>
            <Footer2 />
        </div>
    </div>
</template>
<script>
import Footer2 from "@/components/Footer2.vue";
import Navbar from "@/components/Navbar.vue";
export default {
    name: "Home",

    data() {
        return {
            username: "PLACEHOLDER NAME",
        };
    },

    mounted() {},
    components: {
        // Navbar,
        Footer2,
    },
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
<<<<<<< HEAD
  height: 100vh; /* make sure it covers the full viewport height */
  /* background-color: #343a40;  */
  background-image: linear-gradient(#fff, #0A42AD);
} 
</style>
>>>>>>> 965cf876017fe03dea863e340c1790c02372aad3
=======
    height: 100vh; /* make sure it covers the full viewport height */
    /* background-color: #343a40;  */
    background-image: linear-gradient(#fff, #0a42ad);
}
</style>
>>>>>>> 1642be490aab84fb9f9035b86cad58f93226ff4b
