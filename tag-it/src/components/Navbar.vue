<template>
    <div id="logged" v-if="user">
        <div id="nav">
            <router-link to="/home">Home</router-link> |
            <router-link to="/login">Login</router-link>
        </div>
    </div>
    </nav>
    <div class="collapse" id="navbarToggleExternalContent">
        <span class="nav" style="display: flex; justify-content: center; ">
        <div class="center-nav justify-content-between">
            <ul class="navbar-nav justify-content-between flex-row" aria-expanded="false">
                <li class="nav-item">
                    <router-link to="/">Login</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/home">Home</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/calendar">Calendar</router-link> 
                </li>
                <li class="nav-item">
                    <router-link to="/alltags">All Tags</router-link> 
                </li>
                <li class="nav-item-group">
                <a class="nav-link ml-10" href="#">Groups</a>
                </li>
                <li class="nav-item" id="logOut">
                    <div @click="signOut()">LogOut</div>
                </li>
            </ul>
        </div></span>
    </div>
    <hr></hr>
    
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "../router/index.js";


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
        async signOut() {
            const auth = getAuth();
            const user = auth.currentUser;
            signOut(auth, user);    
            router.push({ name: "Login" });
        },
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

#logOut {
    cursor: pointer;
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

.nav-item-group {
    font-family: 'Montserrat', sans-serif;
    margin-right: 50px;
    font-size:  20px;
    font-weight: bold;
    color: #0A42AD;
}

hr {
    opacity: 0.5;
    margin-bottom: 10%;
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
