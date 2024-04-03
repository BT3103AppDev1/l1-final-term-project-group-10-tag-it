<template>
  <div class="grid-container">
    <button id="create-item" @click="showModal = !showModal">
      <img src="../assets/create-group.png" width="120" />
      <p>Create a Group</p>
    </button>
    <button class="grid-item" v-for="(calendar, index) in calendars" :key="index">
      <p>{{ calendar.calendar_name }}</p>
      <img src="../assets/group.png" width="120" />
      <p>{{ calendar.users.length }} Members</p>
    </button>
    <CreateGroup
      v-if="showModal"
      @closeModal="showModal = false"
      :showModal="showModal"
    />
  </div>
</template>

<script>
// load the data first before page is rendered
import CreateGroup from "@/components/CreateGroup.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";

export default {
  components: {
    CreateGroup,
  },
  data() {
    return {
      showModal: false,
      calendars: [],
    };
  },
  async created() {
    this.initializeAuthStateListener();
  },
  methods: {
    initializeAuthStateListener() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.fetchCalendars(user);
        } else {
          console.log("User is not logged in.");
        }
      });
    },
    async fetchCalendars(user) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, "User", user.uid);

        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const calendarList = userData.calendars || [];

          // Iterate over each calendar ID and fetch its document
          for (const calendarId of calendarList) {
            const calendarDocRef = doc(db, "Calendar", calendarId);
            const calendarDocSnapshot = await getDoc(calendarDocRef);
            if (calendarDocSnapshot.exists()) {
              // Push calendar document data into the calendars array
              this.calendars.push({
                id: calendarDocSnapshot.id,
                ...calendarDocSnapshot.data(),
              });
            } else {
              console.error(
                `Calendar document with ID ${calendarId} does not exist.`
              );
            }
          }
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    },
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 1% 10% 1% 10%;
}

#create-item {
  background-color: #bababa;
  padding: 1%;
  font-size: x-large;
  text-align: center;
  margin: 5% 5% 10% 5%;
  border-radius: 10px;
}

.grid-item {
  background-color: #9fb4db;
  padding: 1%;
  font-size: x-large;
  text-align: center;
  margin: 5% 4% 10% 4%;
  border-radius: 10px;
}
</style>
