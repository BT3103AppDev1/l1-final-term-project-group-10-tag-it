<template>
  <div class="containermy-5">
    <footer style="background-color: #fff">
      <div class="container p-4">
        <div class="row">
          <div class="col-lg-8 col-md-12 mb-4">
            <h5
              class="mb-3"
              style="letter-spacing: 2px; font-weight: bold; color: #0641ad"
            >
              About Tag-It
            </h5>
            <p style="color: #406cbe; text-align: left">
              All your productivity needs in one application! Tag-It is a
              user-friendly, free for all and open source project by a group of
              NUS students.
            </p>
          </div>
          <div class="col-lg-4 col-md-6 mb-4">
            <h5
              class="mb-3"
              style="letter-spacing: 2px; font-weight: bold; color: #0641ad"
            >
              Links
            </h5>
            <ul class="list-unstyled mb-0">
              <!-- <li class="mb-1">
                <a href="#!" style="color: #406cbe">Home</a>
              </li>
              <li class="mb-1">
                <a href="#!" style="color: #406cbe">Calendar</a>
              </li>
              <li class="mb-1">
                <a href="#!" style="color: #406cbe">All Tags</a>
              </li>
              <li>
                <a href="#!" style="color: #406cbe">Groups</a>
              </li>
              <li>
                <a href="#!" style="color: #406cbe">Profile</a>
              </li>
             -->
             <li class="nav-item">
                <router-link to="/home" style="text-decoration: none;">Home</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/calendar" style="text-decoration: none;">Calendar</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/alltags" style="text-decoration: none;">All Tags</router-link> 
            </li>
            <li class="nav-item">
                <router-link to="/groups" style="text-decoration: none;">Groups</router-link>
            <!-- <a class="nav-link ml-10" href="#">Groups</a>o -->
            </li>
            <li class="nav-item">
                <router-link to="/edit-profile" style="text-decoration: none;">Profile</router-link> 
            </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="text-center text-light p-3" style="background-color: #406cbe">
        © 2024 Copyright:
        <a class="text-light" href="">TagIt.com</a>
      </div>
      <!-- Copyright -->
    </footer>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");

footer {
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
}
</style>

<script>
import router from "../router/index.js";

export default {
    name: "Footer2",
}
</script>
