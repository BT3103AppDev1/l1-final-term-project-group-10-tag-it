<template>
  <Navbar />
  <router-view />
  <div class="parent">
    <div class="div1">
      <CalendarComponent />
    </div>
    <div class="div2">
      <MiscellaneousTags v-if='toggleMiscTags' @openExpandedTE="toggleContainer"/>
      <ExpandedTagEntry v-else @returnToMiscTags="toggleContainer"/>
    </div>
    
  </div>
  <Footer />
</template>

<script>
import ExpandedTagEntry from "@/components/ExpandedTagEntry.vue";
import MiscellaneousTags from "@/components/MiscellaneousTags.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue'

export default {
  name: "Calendar",
  data() {
    return{
      toggleMiscTags: true
    }
  },
  components: {
    ExpandedTagEntry,
    MiscellaneousTags,
    CalendarComponent,
    Footer,
    Navbar,
  },

  methods: {
    toggleContainer() {
      this.toggleMiscTags = !this.toggleMiscTags
    }
  }

};
</script>

<style>

.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto; 
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  height: fit-content;
  margin-top: -70px;
}

.div1 { 
  padding-left: 20px;
  padding-right: 20px;
  grid-area: 1 / 1 / 2 / 3; 
  
}
.div2 { grid-area: 1 / 3 / 2 / 4; } 
</style>