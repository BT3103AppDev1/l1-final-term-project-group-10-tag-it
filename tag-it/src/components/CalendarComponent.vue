<template>
  <div>
    <div class="filter-container">
      Filter Calendars
    <BIconArrowBarDown class="filterbutton" @click="filter" />
    
    <div v-if="active">
      <div class="dropdown-content">
        <div
          class="opt-labels"
          v-for="(opt, index) in cals"
          :key="opt.cal_id"
        >
          <input
            id="checkboxes"
            type="checkbox"
            :value="opt.cal_id"
            :checked="checkedStates[opt.cal_id]"
            @change="getCal($event, opt.cal_id)"
          />
          {{ opt.calendar_name }}
          <span class="checkmark"></span>
        </div>
      </div>
    </div>
  </div>
  <div>
    <vue-cal
      :time-from="1 * 60"
      :time-to="24 * 60"
      :disable-views="['years']"
      :events="events"
    ></vue-cal>
  </div>
  
  </div>
  <!-- <button @click="populate_cal_colour_and_cal_id">Add Test Event</button> -->
</template>

<script>
import firebaseApp from "../firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  collection,
  documentId,
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
    BIconArrowBarDown,
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
      console.log("all calenders loading works");
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
      console.log("load_tags_from_firebase_to_calendar");
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
      console.log("in load_tags_from_firebase_to_calendar");
      let tagPromises = [];
      for (let i = 0; i < this.cals.length; i++) {
        let calDoc = await getDoc(doc(db, "Calendar", this.cals[i]["cal_id"]));
        let calTags = calDoc.data().tags;
        console.log("calTags");

        if (calTags && Array.isArray(calTags)) {
          calTags.forEach((tagId) => {
            let tagPromise = getDoc(doc(db, "Tags", tagId)).then((tagDoc) => {
              let tagData = tagDoc.data();
              this.injectStyles(tagData);
              if (tagData) {
                console.log(tagData.color);
                this.events.push({
                  title: tagData.title,
                  completed: tagData.completed,
                  end: tagData.end,
                  start: tagData.start,
                  class: tagData.calendar_name,
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

    //controls the dropdown for filter
    //if true then menu drops down, if false then it doesnt
    async filter() {
      this.active = !this.active;
    },

    //check for checkboxes in the calendar filters
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
        this.events = [];
        this.load_tags_from_firebase_to_calendar();
      } else {
        this.events = [];
        for (let i = 0; i < this.filterCals.length; i++) {
          let docRef = doc(db, "Calendar", this.filterCals[i]);
          let docSnapshot = await getDoc(docRef);
          let tags = docSnapshot.data().tags;
          for (let i = 0; i < tags.length; i++) {
            const tagRef = doc(db, "Tags", tags[i]); // Reference to the tag document
            const tagDoc = await getDoc(tagRef); // Fetch the document
            if (tagDoc.exists()) {
              const tagData = tagDoc.data();
              this.events.push({
                title: tagData.title,
                completed: tagData.completed,
                end: tagData.end,
                start: tagData.start,
                class: tagData.calendar_name,
                color: tagData.color,
                tag_id: tagDoc.id,
                flagged: tagData.flagged,
              }); // Append the tag data to the results array
            } else {
              console.log("Document does not exist for tag:");
            }
          }
        }
      }
    },

    // read the tags from the data base
    // need to update with dionnes method
    /* async readTags() {
      const tagsCollection = collection(db, "Tags");
      const querySnapshot = await getDocs(tagsCollection);
      return querySnapshot;
    }, */

    injectStyles(tag) {
      console.log("calling inject");
      // Ensure the className is valid
      const className = tag.calendar_name;
      if (!className) {
        return; // Skip this tag if className is invalid
      }

      const color = tag.color || "#a04646"; // Default color
      const cssRule = `.vuecal__event.${className} { background-color: ${color}; border: 0.001px solid #fff; color: #fff; }`;
      console.log(cssRule);
      try {
        const style = document.createElement("style");
        document.head.appendChild(style);
        style.sheet.insertRule(cssRule, style.sheet.cssRules.length);
      } catch (e) {
        console.error("Failed to insert CSS rule:", cssRule, e);
      }
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

<style scoped>
/* @import "@/assets/main.css"; */


::v-deep .vuecal {
  height: 90%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  font-family: cabin;

}

::v-deep .vuecal__title-bar {
    background-color: rgb(87, 139, 207);
}
::v-deep .vuecal__title-bar button {
    color: #f5f5f5;
}

::v-deep .vuecal__view-btn button aria-label {
  color: #0641AD;
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
  font-family: cabin, Serif;
  font-size: 1.2em;
  font-weight: bold;

  margin: 4px 0 8px;
}

.vuecal__event-content {
  font-style: italic;
  margin: auto;
  padding: auto;
}

.vuecal__event.sports {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}

/* Base container styling */
.filter-container {
    position: relative;
    padding: 10px;
    background: #f3f4f6;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family: cabin, sans-serif;
}

/* Filter button styling */
.filter-container .filterbutton {
    cursor: pointer;
    color: #0056b3;
    background: none; /* Remove the background color */
    border: none;
    margin-left: 10px;
    transition: transform 0.3s ease-in-out;
}

.filter-container .filterbutton:hover {
    transform: rotate(180deg); /* Optional: Rotate the icon on hover */
}

/* Dropdown content box */
.dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    padding: 10px;
    margin-top: 2px;
    z-index: 1000;
}

/* Option label styling */
.opt-labels {
    display: block;
    margin: 5px 0;
    cursor: pointer;
    padding: 3px;
    justify-content: left;
    transition: background-color 0.3s;
}

.opt-labels:hover {
    background-color: #f8f8f8;
}

/* Custom checkbox styling */
input[type="checkbox"] {
    position: relative;
    cursor: pointer;
    width: 20px;
    height: 20px;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;
    border: 2px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: background 0.3s, border-color 0.3s;
}

input[type="checkbox"]:checked {
    background-color: #0056b3;
    border-color: #0056b3;
}

input[type="checkbox"]:checked:after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Text next to checkbox */
.opt-labels span {
    padding-left: 8px;
}

/* Hide the checkmark span used originally */
.checkmark {
    display: none;
}

</style>