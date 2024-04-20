<template>
  <vue-cal
    class="vuecal--blue-theme"
    :time-from="1 * 60"
    :time-to="24 * 60"
    :disable-views="['years']"
    :events="events"
    :on-event-click="onEventClick"
  ></vue-cal>

  <v-dialog v-model="showDialog">
    <p>'hello'</p>
  </v-dialog>

  <button @click="addTagToCal">Add Test Event</button>
</template>

<script>
import firebaseApp from "../firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import VueCal from "vue-cal";
import "vue-cal/dist/vue-cal.css";
import {
  BIconFlag,
  BIconFlagFill,
  BIconTrashFill,
  BIconCircle,
  BIconCheckCircleFill,
  BIconFunnelFill,
} from "bootstrap-icons-vue";

const db = getFirestore(firebaseApp);

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
      active: false,
      showDialog: false,
      filterConditions: {
        importance: false,
        startDate: false,
        endDate: false,
      },
    };
  },
  methods: {
    // read the tags from the data base
    // need to update with dionnes method
    async readTags() {
      const tagsCollection = collection(db, "Tags");
      const querySnapshot = await getDocs(tagsCollection);
      return querySnapshot;
    },

    injectStyles(tag) {
      // Ensure the className is valid
      const className = tag.calendar_name;
      if (!className) {
        console.error("ClassName is undefined or empty", tag);
        return; // Skip this tag if className is invalid
      }

      const color = tag.color || "#a04646"; // Default color
      const cssRule = `.vuecal__event.${className} { background-color: ${color}; border: 0.001px solid #fff; color: #fff; }`;

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
          contentFull: "Okay.<br>It will be a 18 hole golf course.",
          class: unwrapped_tag.calendar_name,
          color: unwrapped_tag.color,
        });
      });
      this.dynamicCss = styles;
    },

    onEventClick (event, e) {
      this.selectedEvent = event
      this.showDialog = true

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
    //dionne's method
    async fetchAndUpdateData() {
      let allDocuments = await getDocs(collection(db, "Tags"));

      this.tableRows = await Promise.all(
        allDocuments.docs.map(async (doc) => {
          let documentData = doc.data();

          let title = documentData.title;
          let completed = documentData.completed;
          let end = documentData.end;
          let start = documentData.start;
          let calendar = documentData.calendar_name;
          //let id = documentData.id;
          let tag_id = doc.id;
          let flagged = documentData.flagged;

          return {
            title,
            completed,
            end,
            start,
            calendar,
            tag_id,
            flagged,
          };
        })
      );
    },
  },

  mounted() {
    this.addTagToCal();
  },
};
</script>

<style>
.vuecal__event {
  cursor: pointer;
}

.vuecal {
  height: 100%;
  width: 80%;
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
