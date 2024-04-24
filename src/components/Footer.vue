<template>
    <div class="containermy-5">

    <footer style="background-color: #406CBE;">
    <div class="container p-4">
    <div class="row">
        <div class="col-lg-8 col-md-12 mb-4">
        <h5 class="mb-3" style="letter-spacing: 2px; font-weight:bold; color: #fff;">About Tag-It</h5>
        <p style="color: #fff; text-align: left;">
            All your productivity needs in one application! Tag-It is a user-friendly, free for all and open source project by a group of NUS students.
        </p>
        </div>
        <div class="col-lg-4 col-md-6 mb-4">
        <h5 class="mb-3" style="letter-spacing: 2px; font-weight:bold; color: #fff;">Links</h5>
        <ul class="list-unstyled mb-0">
            <li class="nav-item">
                <router-link to="/home" style="color: #fff; text-decoration: none;">Home</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/calendar" style="color: #fff; text-decoration: none;">Calendar</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/alltags" style="color: #fff; text-decoration: none;">All Tags</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/groups" style="color: #fff; text-decoration: none;">Groups</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/edit-profile" style="color: #fff; text-decoration: none;">Profile</router-link> 
            </li>
        </ul>
        </div>

    </div>
    </div>
    <div class="text-center text-light p-3" style="background-color: #0641AD;">
    © 2024 Copyright:
    <a class="text-light" href="">TagIt.com</a>
    </div>
    <!-- Copyright -->
    </footer>

</div>
</template>
    
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

footer {
    font-family: 'Montserrat', sans-serif;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

router-link {
    color: #fff;
}

</style>

<script>
import router from "../router/index.js";

export default {
    name: "Footer",
}
</script>