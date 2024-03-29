<template>
    <div class="full-page-bg">
        <div class="texts">
            <h1 class="welcome-msg">
                Welcome Mervyn! 
                <!-- name will be accessed from the database -->
            </h1>
            <h1 class="tags-msg">
                Your have 4 Tags today! 
                <!-- number of Tags will be accessed from the database -->
            </h1>
        </div>
        <Footer2/>
    </div>
</template>

<script>
import Footer2 from '@/components/Footer2.vue';
export default {
    name: "Home",
    components: {
        Footer2,
    }
}
</script>

<style>

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