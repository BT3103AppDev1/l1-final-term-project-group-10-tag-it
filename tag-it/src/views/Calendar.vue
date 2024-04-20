<template>
  <ExpandedTagEntry />
  <MiscellaneousTags />
  <CalendarComponent />
</template>

<script>
import ExpandedTagEntry from "@/components/ExpandedTagEntry.vue";
import MiscellaneousTags from "@/components/MiscellaneousTags.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
export default {
  name: "Calendar",
  components: {
    ExpandedTagEntry,
    MiscellaneousTags,
    CalendarComponent,
  },
};
</script>
