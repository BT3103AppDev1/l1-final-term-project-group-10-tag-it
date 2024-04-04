<template>
  <vue-cal
    class="vuecal--blue-theme"
    :time-from="1 * 60"
    :time-to="24 * 60"
    :disable-views="['years']"
    :events="events"
  ></vue-cal>

  <button @click="addTagToCal">Add Test Event</button>
</template>

<script>
import app from "../firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import VueCal from "vue-cal";
import "vue-cal/dist/vue-cal.css";

const db = getFirestore(app);

export default {
  components: { VueCal },
  data() {
    return {
      events: [
        {
          start: "2024-04-04 13:30",
          end: "2024-04-04 14:30",
          title: "Need to go shopping",
          content: '<i class="icon material-icons">shopping_cart</i>',
          class: "leisure",
        },
      ],
    };
  },
  methods: {
    addTimeEvent(start, end, title, content, eventClass) {
      const newEvent = {
        start,
        end,
        title,
        content,
        eventClass,
      };
      this.events.push(newEvent);
    },
    async readTags() {
      const tagsCollection = collection(db, "Tags");
      const querySnapshot = await getDocs(tagsCollection);
      querySnapshot.forEach((doc) => {
        console.log(doc);
      });
      return querySnapshot;
    },

    writeTags() {},

    async addTagToCal() {
      const relevant_tags = await this.readTags();
      relevant_tags.forEach((tag_info) => {
        let unwrapped_tag = tag_info.data();
        console.log(unwrapped_tag.start);
        this.addTimeEvent(
          unwrapped_tag.start,
          unwrapped_tag.end,
          unwrapped_tag.title,
          unwrapped_tag.content,
          unwrapped_tag.class
        );
      });
    },

    // add a delete tag method
    deleteTag(tagname) {},
  },
};

/*special hours method*/
/*Timeless events*/
/*Events with time information*/
/* Open a dialog box on event click (might want to make this our own function)*/
/*event indicators*/
/*display events on month view*/
/*edit and delete events*/
/*create events*/
/*event drag and drop*/
/*multiple day events*/
/*overlapping events*/
/*all day events*/
/*splitting days and split events*/

/* very important
emitted events from cal
*/
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vuecal {
  height: 100%;
  width: 100%;
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

/*set the colour of event categories */
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}
.vuecal__event.sport {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
</style>
