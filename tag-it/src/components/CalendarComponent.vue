<template>
  <div>
    <vue-cal
      class="vuecal--blue-theme"
      :time-from="1 * 60"
      :time-to="24 * 60"
      :disable-views="['years']"
      :events="events"
    ></vue-cal>
  </div>
  <button @click="populate_cal_colour_and_cal_id">Add Test Event</button>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import VueCal from "vue-cal";
import "vue-cal/dist/vue-cal.css";
import {
  BIconArrowBarDown,
  BIconFlag,
  BIconFlagFill,
  BIconTrashFill,
  BIconCircle,
  BIconCheckCircleFill,
  BIconFunnelFill,
} from "bootstrap-icons-vue";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
  components: {
    VueCal,
    BIconFlag,
    BIconFlagFill,
    BIconTrashFill,
    BIconCircle,
    BIconCheckCircleFill,
    BIconFunnelFill,
  },

  data() {
    return {
      events: [],
      calendars: [],
      filterCals: [],
      originalRows: [],
      checkedStates: {}, // for checked cals to remain checked even when dropdown is closed
      active: false,
      // user auth
      cal_name: "",
      cal_color: "",
      calName_calColor: {}, //populate with data from firebase
      calName_calId: {},
      user_id: "",
      user_calendars: [], // only their id
      miscCal_id: "",
    };
  },

  async mounted() {
    console.log("calling on mounted");
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user_id = user.uid;
        console.log(this.user_id);
        this.populate_cal_colour_and_cal_id();
      }
    });
    this.addTagToCal();
  },

  methods: {
    // get user specific data such as their personal calendars and shared calendars
    async getUserCalendars() {
      const objToMap = (obj) => new Map(Object.entries(obj));

      let user_data = await getDoc(doc(db, "User", this.user_id));
      let personal_calendars = objToMap(user_data.data().personal_calendars);
      let shared_calendars = objToMap(user_data.data().shared_calendars);
      let miscCal_id = objToMap(user_data.data().misc_calendar);
      console.log('all calenders loading works')
      //adding personal calendar id from personal calendars
      if (personal_calendars.size > 0) {
        personal_calendars.forEach((value, key) => {
          this.user_calendars.push(key);
        });
      }

      //adding shared calendar id from shared calendars
      if (shared_calendars.size > 0) {
        shared_calendars.forEach((value, key) => {
          this.user_calendars.push(key);
        });
      }

      // populating this.cals
      if (this.user_calendars.length > 0) {
        const calendarCollection = collection(db, "Calendar");
        const chunks = [];
        for (let i = 0; i < this.user_calendars.length; i += 10) {
          const chunk = this.user_calendars.slice(i, i + 10);
          const querySnapshotPromise = getDocs(
            query(calendarCollection, where(documentId(), "in", chunk))
          );
          chunks.push(querySnapshotPromise);
        }

        const results = await Promise.all(chunks); // Resolve all batch queries
        this.cals = results.flatMap((querySnapshot) =>
          querySnapshot.docs.map((doc) => ({
            calendar_name: doc.data().calendar_name,
            cal_id: doc.id,
          }))
        );
      }
      console.log('load_tags_from_firebase_to_calendar')
      this.load_tags_from_firebase_to_calendar();
    },

    // populate the cal name and cal colour
    async populate_cal_colour_and_cal_id() {
      // get calendars of the current users
      console.log("calling getUSerCalendars");
      await this.getUserCalendars();
      console.log("done with getting usercals");

      //iterate through user calendars
      this.user_calendars.map(async (calId) => {
        let cur_cal_doc = await getDoc(doc(db, "Calendar", calId));
        let documentData = cur_cal_doc.data();
        let cal_id = cur_cal_doc.id;
        let cal_name = documentData.calendar_name;
        let cal_color = documentData.color;

        //setting up the dictionary of category to their specific colors
        this.calName_calColor[cal_name] = cal_color;
        this.calName_calId[cal_name] = cal_id;
      });
    },

    // get the data from all user calendars and update the calendar
    async load_tags_from_firebase_to_calendar() {
      console.log('in load_tags_from_firebase_to_calendar')
      let tagPromises = [];
      for (let i = 0; i < this.cals.length; i++) {
        let calDoc = await getDoc(doc(db, "Calendar", this.cals[i]["cal_id"]));
        let calTags = calDoc.data().tags;
        console.log('calTags');

        if (calTags && Array.isArray(calTags)) {
          calTags.forEach((tagId) => {
            let tagPromise = getDoc(doc(db, "Tags", tagId)).then((tagDoc) => {
              let tagData = tagDoc.data();
              if (tagData) {
                this.events.push({
                  title: tagData.title,
                  completed: tagData.completed,
                  end: tagData.end,
                  start: tagData.start,
                  calendar: this.cals[i]["calendar_name"],
                  color: tagData.color,
                  tag_id: tagDoc.id,
                  flagged: tagData.flagged,
                });
              }
            });
          });
        }
      }
    },

    /* //check for checkboxes in the calendar filters
    async getCal(event, cal_id) {
      this.checkedStates[cal_id] = event.target.checked;
      console.log(this.checkedStates);
      const isChecked = event.target.checked;
      if (isChecked) {
        this.filterCals.push(cal_id);
        this.loadCals();
      } else {
        this.filterCals = this.filterCals.filter((item) => item !== cal_id);
        console.log("this is removed", cal_id);
        this.loadCals();
      }
    },

    // only load the calendar tags from the filtered calendars
    async loadCals() {
      if (this.filterCals.length === 0) {
        this.fetchAndUpdateData();
      } else {
        let newRows = [];
        for (let i = 0; i < this.filterCals.length; i++) {
          let docRef = doc(db, "Calendar", this.filterCals[i]);
          let docSnapshot = await getDoc(docRef);
          let tags = docSnapshot.data().tags;
          for (let i = 0; i < tags.length; i++) {
            const tagRef = doc(db, "Tags", tags[i]); // Reference to the tag document
            const tagDoc = await getDoc(tagRef); // Fetch the document
            if (tagDoc.exists()) {
              const documentData = tagDoc.data(); // Get the data of the tag document
              const tagData = {
                title: documentData.title,
                completed: documentData.completed,
                end: documentData.end,
                start: documentData.start,
                calendar: documentData.calendar_name,
                color: documentData.color,
                tag_id: tagDoc.id, // Use the document ID
                flagged: documentData.flagged,
              };
              newRows.push(tagData); // Append the tag data to the results array
            } else {
              console.log("Document does not exist for tag:", tags[i]);
            }
          }
        }
        this.tableRows = newRows;
      }
    }, */

    // read the tags from the data base
    // need to update with dionnes method
    /* async readTags() {
      const tagsCollection = collection(db, "Tags");
      const querySnapshot = await getDocs(tagsCollection);
      return querySnapshot;
    }, */

    injectStyles(tag) {
      // Ensure the className is valid
      const className = tag.calendar_name;
      if (!className) {
        return; // Skip this tag if className is invalid
      }

      const color = tag.color || "#a04646"; // Default color
      const cssRule = `.vuecal__event.${className} { background-color: ${color}; border: 0.001px solid #fff; color: #fff; }`;

      try {
        const style = document.createElement("style");
        document.head.appendChild(style);
        style.sheet.insertRule(cssRule, style.sheet.cssRules.length);
      } catch (e) {}
    },

    // add the tags to calendar and update styles
    async addTagToCal() {
      const relevant_tags = await this.readTags();
      let styles = "";
      relevant_tags.forEach((tag_info) => {
        let unwrapped_tag = tag_info.data();

        this.injectStyles(unwrapped_tag);

        this.events.push({
          start: unwrapped_tag.start,
          end: unwrapped_tag.end,
          title: unwrapped_tag.title,
          content: "Do I need to tell how many holes?",
          // consider if we want to add this field
          contentFull: "Okay.<br>It will be a 18 hole golf course.",
          class: unwrapped_tag.calendar_name,
          color: unwrapped_tag.color,
        });
      });
      this.dynamicCss = styles;
    },
  },
};
</script>

<style>
.vuecal {
  height: 100%;
  width: 80%;
  border-radius: 10px;
  overflow: hidden;
}

.vuecal--month-view .vuecal__cell {
  height: 80px;
}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {
  padding: 4px;
}

.vuecal--month-view .vuecal__no-event {
  display: none;
}

.vuecal__event-title {
  font-family: "Times New Roman", Serif;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  padding: auto;
}

.vuecal__event-content {
  font-style: italic;
  margin: auto;
  padding: auto;
}
</style>
