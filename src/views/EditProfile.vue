<template>
  <Navbar />
  <router-view />
  <form @submit.prevent="editProfile" id="firstContainer">
    <div class="header1">EDIT PROFILE</div>
    <br />
    <div id="secondContainer">
      <div id="column">
        <label for="firstName">First Name:</label>
        <input
          id="firstName"
          class="editProfileInput"
          v-model="firstName"
          required
        />
        <label for="username">Username:</label>
        <input
          id="username"
          class="editProfileInput"
          v-model="username"
          required
        />
      </div>
      <div id="column">
        <label for="lastName">Last Name:</label>
        <input
          id="lastName"
          class="editProfileInput"
          v-model="lastName"
          required
        />
        <label for="mobileNumber">Mobile Number:</label>
        <input
          id="mobileNumber"
          class="editProfileInput"
          v-model="mobileNumber"
          required
        />
      </div>
    </div>
    <br />
    <button class="blueButton" id="saveButton" type="submit">SAVE</button>
  </form>
  <Footer />
</template>

<style scoped>
#firstContainer {
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 10px;
  height: fit-content;
  width: 50%;
  margin: auto;
  filter: drop-shadow(2px 2px);
  border-radius: 25px;
  padding: 2%;
  font-family: cabin;
  margin-bottom: 10%;
}

#secondContainer {
  display: flex;
  text-align: center;
  justify-content: space-around;
  margin: 0;
  font-family: cabin;
}

#column {
  display: flex;
  flex-direction: column;
  width: 50%;
  float: left;
}

label {
  text-align: left;
  display: inline-block;
  font-size: large;
  font-family: cabin;
}

h2 {
  color: rgb(0, 0, 0);
  text-align: left;
  margin-bottom: 2%;
  font-family: cabin;
}

.form-group {
  margin-bottom: 15px;
  /* grid-column: 1 / -1; */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* grid-template-columns: 1fr; */
  gap: 10px;
  margin: 10px auto;
}

#firstName,
#username,
#lastName,
#mobileNumber {
  width: 80%;
  /* height: 30px; */
}

.blueButton {
  width: 20%;
}

.editProfileInput {
  height: 2.5em;
  margin-left: 10px;
  width: 80%;
  text-align: left;
  margin-bottom: 10px;
  border-radius: 10px;
  border-width: 1.5px;
}
form {
  margin-bottom: 5%;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      mobileNumber: "",
    };
  },
  created() {
    this.initializeAuthStateListener();
  },
  methods: {
    initializeAuthStateListener() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.fetchUserData();
        } else {
          console.log("User is not logged in.");
        }
      });
    },
    fetchUserData() {
      const auth = getAuth();
      const user = auth.currentUser;

      const db = getFirestore();
      const userDocRef = doc(db, "User", user.uid);

      getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            this.firstName = userData.first_name;
            this.lastName = userData.last_name;
            this.username = userData.username;
            this.mobileNumber = userData.mobile_number;
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    },

    editProfile() {
      const newUserData = {
        first_name: this.firstName,
        last_name: this.lastName,
        username: this.username,
        mobile_number: this.mobileNumber,
      };

      const auth = getAuth();
      const user = auth.currentUser;

      const db = getFirestore();
      const usersCollection = collection(db, "User");

      const queryByUsername = query(
        usersCollection,
        where("username", "==", this.username)
      );
      const queryByMobileNumber = query(
        usersCollection,
        where("mobile_number", "==", this.mobileNumber)
      );

      Promise.all([getDocs(queryByUsername), getDocs(queryByMobileNumber)])
        .then(([usernameSnapshot, mobileNumberSnapshot]) => {
          if (
            !mobileNumberSnapshot.empty &&
            mobileNumberSnapshot.docs[0].id !== user.uid
          ) {
            alert("Mobile number already exists!");
            console.error("Mobile number already exists");
          } else if (
            !usernameSnapshot.empty &&
            usernameSnapshot.docs[0].id !== user.uid
          ) {
            alert("Username already exists!");
            console.error("Username already exists");
          } else {
            const userDocRef = doc(db, "User", user.uid);
            updateDoc(userDocRef, newUserData)
              .then(() => {
                alert("Profile saved!");
                console.log("Profile data updated successfully");
              })
              .catch((error) => {
                console.error("Error updating profile data:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error querying database:", error);
        });
    },
  },
};
</script>
