<template>
  <div class="quickAddTag">
    <form class="quickAddTagForm" @submit.prevent="massAddTags">
      <input
        type="text"
        placeholder="Quick add tag..."
        v-model="inputData"
        id="quickAddTag"
        required="yes"
      />
      <!-- not sure how to put icon over form -->
      <i class="expandTag" @click="expandTagEntry">
        <BIconArrowsAngleExpand />
      </i>
    </form>
  </div>
</template>

<script>
import { BIconArrowsAngleExpand } from "bootstrap-icons-vue";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import firebaseApp, { auth } from "../firebase.js";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      user: null,
      inputData: "",
    };
  },
  created() {
    this.monitorAuthState();
  },
  methods: {
    monitorAuthState() {
      onAuthStateChanged(auth, (loggedUser) => {
        if (loggedUser) {
          this.user = loggedUser;
        }
      });
    },
    expandTagEntry(event) {
      this.$emit("openExpandedTagEntry");
    },

    async massAddTags() {
      // take the input and split it into an array
      const rawString = document.getElementById("quickAddTag").value;
      const splitList = rawString.split(",");

      let miscCalendarId;
      // get the user's misc_calendar id
      try {
        const user = auth.currentUser;
        const userDocRef = doc(db, "User", user.uid);

        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          miscCalendarId = docSnapshot.data().misc_calendar;
        }
      } catch (error) {
        console.error("Error getting Misc Calendar ID: ", error);
      }

      // get misc_calendar name (not relevant since it should always be "")
      // try {
      //     const miscCalRef = doc(db, "Calendar", miscCalendarId);

      //     await getDoc(miscCalRef).then((docuSnapshot) => {
      //         if (docuSnapshot.exists()) {
      //             const miscCalendarName =
      //                 docSnapshot.data().calendar_name;
      //             console.log(miscCalendarName);
      //         }
      //     });
      // } catch (error) {
      //     console.error("Error getting Misc Calendar Name: ", error);
      // }

      const miscCalDocRef = doc(db, "Calendar", miscCalendarId);

      // iterate through the array
      for (let i = 0; i < splitList.length; i++) {
        const tagTitle = splitList[i].trim();

        let tagImportance;
        // check if important
        if (tagTitle.includes("!")) {
          tagImportance = false;
        } else {
          tagImportance = true;
        }
        // for each tag, add into tag DB
        const tagDocRef = await addDoc(collection(db, "Tags"), {
          title: tagTitle,
          calendar_id: miscCalendarId,
          calendar_name: "",
          flagged: tagImportance,
          start: "",
          end: "",
          color: "",
          completed: false,
        });
        const tag_id = tagDocRef.id;

        // for each tag, add into calendar DB
        await updateDoc(miscCalDocRef, {
          tags: arrayUnion(tag_id),
        });
      }

      this.inputData = "";
      this.$emit("refresh-required");
    },
  },

  components: {
    BIconArrowsAngleExpand,
  },

  props: {
    icon: BIconArrowsAngleExpand,
  },
};
</script>

<style scoped>
@import "@/assets/main.css";

.quickAddTag {
  font-family: cabin;
  font-size: 18px;
}

.quickAddTagForm i {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  pointer-events: auto;
}

input {
  border-radius: 25px;
  border-color: rgb(87, 139, 207);
  background-color: rgb(87, 139, 207);
  width: 340px;
  height: 52px;
  /* text-align: left; */
  border-width: 1px;
  padding: 0px 10px 0px 10px;
}

#quickAddTag {
  padding-right: 2.5em;
  color: #f5f5f5;
}

input::placeholder {
  color: #f5f5f5;
}

.expandTag {
  color: #f5f5f5;
}
</style>
