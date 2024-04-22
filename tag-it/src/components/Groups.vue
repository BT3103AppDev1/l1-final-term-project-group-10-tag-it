<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div class="grid-container">
      <button id="create-item" @click="showModal = !showModal">
        <img src="../assets/create-group.png" width="120" />
        <p>Create a Group</p>
      </button>
      <button
        class="grid-item"
        v-for="(calendar, index) in calendars"
        :key="index"
        @click="openCalendarModal(calendar)"
      >
        <p>{{ calendar.calendar_name }}</p>
        <img src="../assets/group.png" width="120" />
        <p>{{ calendar.users.length }} Members</p>
      </button>
      <CreateGroup
        v-if="showModal"
        @closeModal="showModal = false"
        :showModal="showModal"
      />

      <EditGroup
        v-if="showPopup"
        @closePopup="showPopup = false"
        @groupDeleted="handleGroupDeleted"
        :showPopup="showPopup"
        :calendarData="selectedCalendar"
      />
    </div>
  </div>
</template>

<script>
import CreateGroup from "@/components/CreateGroup.vue";
import EditGroup from "@/components/EditGroup.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
  components: {
    CreateGroup,
    EditGroup,
  },
  data() {
    return {
      showModal: false,
      showPopup: false,
      selectedCalendar: {},
      calendars: [],
      loading: true,
    };
  },
  async created() {
    this.initializeAuthStateListener();
  },
  methods: {
    handleGroupDeleted(deletedGroupId) {
      this.calendars = this.calendars.filter(
        (calendar) => calendar.id !== deletedGroupId
      );
    },
    initializeAuthStateListener() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.fetchCalendars(user);
        } else {
          console.log("User is not logged in.");
          this.loading = false;
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
          const calendarMap = userData.shared_calendars || [];

          for (const calendarId of Object.keys(calendarMap)) {
            const calendarDocRef = doc(db, "Calendar", calendarId);
            const calendarDocSnapshot = await getDoc(calendarDocRef);
            if (calendarDocSnapshot.exists()) {
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
      } finally {
        this.loading = false;
      }
    },
    openCalendarModal(calendar) {
      this.selectedCalendar = calendar;
      this.showPopup = true;
    },
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 1% 10%;
  justify-content: space-evenly;
  align-items: center;
}

#create-item {
  background-color: #bababa;
  padding: 1%;
  font-size: x-large;
  text-align: center;
  margin: 5% 5% 5% 5%;
  border-radius: 10px;
  height: 34vh;
  width: 20vw;
}

.grid-item {
  background-color: #9fb4db;
  padding: 1%;
  font-size: x-large;
  text-align: center;
  margin: 5% 5% 5% 5%;
  border-radius: 10px;
  height: 34vh;
  width: 20vw;
}
</style>
