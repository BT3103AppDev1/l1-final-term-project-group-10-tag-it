<template >
    <nav class="navbar">
        
    <div class="container-fluid" style="padding-left:30px; padding-right:30px;">
        <a class="navbar-brand " href="#">
            <img src="../assets/tagit3.png" alt="Bootstrap" width="100" >
        </a>
        <button class="navbar-toggler ms-auto border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
    </div>
    </nav>
    <div class="collapse" id="navbarToggleExternalContent">
        <span class="nav" style="display: flex; justify-content: center; ">
        <div class="center-nav justify-content-between">
            <ul class="navbar-nav justify-content-between flex-row" aria-expanded="false">
                <!-- <li class="nav-item">
                    <router-link to="/">Login</router-link> 
                </li> -->
                <li class="nav-item">
                    <router-link to="/home" style="color:#0A42AD; text-decoration: none;">Home</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/calendar" style="color:#0A42AD; text-decoration: none;">Calendar</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/alltags" style="color:#0A42AD; text-decoration: none;">All Tags</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/groups" style="color:#0A42AD; text-decoration: none;">Groups</router-link>
                <!-- <a class="nav-link ml-10" href="#">Groups</a>o -->
                </li>
                <li class="nav-item">
                    <router-link to="/edit-profile" style="color:#0A42AD; text-decoration: none;">Profile</router-link> 
                </li>
                <li class="nav-item-logout" id="logOut">
                    <div @click="signOutToast()" style="color:#0A42AD; text-decoration: none;">LogOut</div>
                </li>
            </ul>
        </div></span>
    </div>
    <hr>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router/index.js";
import { signOutFunc, signOutToast } from './LogOut.vue';

export default {
    name: "Navbar",

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            } else {
                router.push({ name: "Login" });
            }
        });
    },

    methods: {
        signOutFunc,
        signOutToast
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');


navbar {
    margin-bottom: 0px;
}
.nav-item{
    font-family: 'Montserrat', sans-serif;
    margin-right: 50px;
    /* font-size:  1.5vw; */
    font-size:  20px;
    font-weight: bold;
    color: #0A42AD;
    border-right: 0.1rem solid #000; /* Add a border right */
    padding-right: 50px; 
}

.nav-item-logout {
    font-family: 'Montserrat', sans-serif;
    margin-right: 50px;
    font-size:  20px;
    font-weight: bold;
    color: rgb(13, 110, 253);
}

.nav-item-logout:hover {
    color: #0A42AD;
    cursor: pointer;
}

hr {
    opacity: 0.5;
    margin-bottom: 2%;
}

.navbar-nav {
    margin: 0;
    padding: 0;
}

button {
    background-color: transparent;
    border: transparent;
}

nav {
    height: 120px;
    background-color: white;
}

</style>