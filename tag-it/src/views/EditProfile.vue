<template>
  <form @submit.prevent="saveProfile" id="firstContainer">
    <h2>EDIT PROFILE</h2>
    <div id="secondContainer">
      <div id="column">
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="firstName" required />
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div id="column">
        <label for="lastName">Last Name:</label>
        <input id="lastName" v-model="lastName" required />
        <label for="mobileNumber">Mobile Number:</label>
        <input id="mobileNumber" v-model="mobileNumber" required />
      </div>
    </div>

    <button id="saveButton" type="submit">
      <p>SAVE</p>
    </button>
  </form>

  <form @submit.prevent="logOut">
    <button id="logOutButton" type="submit">LOG OUT</button>
  </form>
</template>

<style scoped>
#firstContainer {
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 10px;
  height: fit-content;
  width: 40%;
  margin: auto;
  margin-top: 15%;
  filter: drop-shadow(2px 2px);
  border-radius: 25px;
  padding: 20px;
}

#secondContainer {
  display: flex;
  text-align: center;
  justify-content: space-around;
  margin: 0;
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
}

input {
  font-size: medium;
  margin-left: 1%;
}

h2 {
  color: rgb(0, 0, 0);
  text-align: left;
  margin-bottom: 2%;
}

#firstName,
#email,
#lastName,
#mobileNumber {
  width: 80%;
  height: 30px;
}

#saveButton {
  background-color: #406cbe;
  color: white;
  border-radius: 10px;
  margin-top: 3%;
  margin-bottom: 2%;
  height: 50px;
  width: 25%;
  text-align: center;
}

#saveButton p {
  text-align: center;
  font-size: medium;
}

/* @media only screen and (max-width: 1000px) {
  #firstContainer {
    font-size: 10px;
    width: 100%;
  }
} */

#logOutButton {
  background-color: rgb(94, 91, 91);
  color: white;
  border-radius: 10px;
  margin: auto;
  margin-top: 2%;
  padding: 10px 25px;
  height: 50px;
  width: 10%;
  text-align: center;
  font-size: medium;
}
</style>

<script>
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
    };
  },
  methods: {
    saveProfile() {
      const newUserData = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        mobileNumber: this.mobileNumber,
      };

      const auth = getAuth();
      const user = auth.currentUser;

      const db = getFirestore();
      const usersCollection = collection(db, "users");

      const queryByEmail = query(usersCollection, where("email", "==", this.email));
      const queryByMobileNumber = query(usersCollection, where("mobileNumber", "==", this.mobileNumber));

      Promise.all([getDocs(queryByEmail), getDocs(queryByMobileNumber)])
        .then(([emailSnapshot, mobileNumberSnapshot]) => {
          if (!emailSnapshot.empty) {
            console.error("Email already exists");
            alert('Email already exists!');
          } else if (!mobileNumberSnapshot.empty) {
            alert('Mobile number already exists!');
            console.error("Mobile number already exists");
          } else {
            const userDocRef = doc(db, "users", user.uid);
            setDoc(userDocRef, newUserData)
              .then(() => {
                alert('Profile saved!');
                console.log("Profile data saved successfully");
              })
              .catch((error) => {
                console.error("Error saving profile data:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error querying database:", error);
        });
    },

    logOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("User signed out successfully");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    },
  },
};
</script>
