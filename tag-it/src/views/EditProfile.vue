<template>
  <form @submit.prevent="editProfile" id="firstContainer">
    <h2>EDIT PROFILE</h2>
    <div id="secondContainer">
      <div id="column">
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="firstName" required />
        <label for="username">Username:</label>
        <input id="username" v-model="username" required />
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
    <button id="logOutButton" type="submit">
      <p>LOG OUT</p>
    </button>
  </form>
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

input {
  font-size: medium;
  margin-left: 1%;
  margin-bottom: 4%;
  font-family: cabin;
}

h2 {
  color: rgb(0, 0, 0);
  text-align: left;
  margin-bottom: 2%;
  font-family: cabin;
}

#firstName,
#username,
#lastName,
#mobileNumber {
  width: 80%;
  height: 30px;
}

#saveButton {
  background-color: #406cbe;
  color: white;
  border-radius: 10px;
  margin-top: 2%;
  margin-bottom: 1%;
  width: 26%;
  text-align: center;
  font-family: cabin;
}

#saveButton p {
  text-align: center;
  font-size: medium;
  font-family: cabin;
  margin-top: 7%;
  margin-bottom: 7%;
}

#saveButton:hover {
  background-color: white;
  color: #406cbe;
  cursor: pointer;
}

#logOutButton {
  background-color: rgb(94, 91, 91);
  color: white;
  border-radius: 10px;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 12%;
  text-align: center;
  font-family: cabin;
}

#logOutButton p {
  text-align: center;
  font-size: medium;
  font-family: cabin;
  margin-top: 7%;
  margin-bottom: 7%;
}

#logOutButton:hover {
  background-color: white;
  color: rgb(94, 91, 91);
  cursor: pointer;
}

form {
  margin-bottom: 5%;
}
</style>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc,} from "firebase/firestore";

export default {
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

      const queryByUsername = query(usersCollection, where("username", "==", this.username));
      const queryByMobileNumber = query(usersCollection, where("mobile_number", "==", this.mobileNumber));

      Promise.all([getDocs(queryByUsername), getDocs(queryByMobileNumber)])
        .then(([usernameSnapshot, mobileNumberSnapshot]) => {
          if (!mobileNumberSnapshot.empty && mobileNumberSnapshot.docs[0].id !== user.uid) {
            alert("Mobile number already exists!");
            console.error("Mobile number already exists");
          } else if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== user.uid) {
            alert("Username already exists!");
            console.error("Username already exists");
          } else {
            const userDocRef = doc(db, "User", user.uid);
            setDoc(userDocRef, newUserData)
              .then(() => {
                alert("Profile saved!");
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
