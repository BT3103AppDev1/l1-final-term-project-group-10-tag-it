<template>
  <ExpandedTagEntry />
  <MiscellaneousTags />
  <calendar_component />
</template>

<script>
import ExpandedTagEntry from "@/components/ExpandedTagEntry.vue";
import MiscellaneousTags from "@/components/MiscellaneousTags.vue";
import calendar_component from "@/components/calendar_component.vue";
export default {
  name: "Calendar",
  components: {
    ExpandedTagEntry,
    MiscellaneousTags,
    calendar_component,
  },
};
</script>
