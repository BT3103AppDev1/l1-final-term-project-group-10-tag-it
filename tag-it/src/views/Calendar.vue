<template>
    <ExpandedTagEntry />
    <MiscellaneousTags />
</template>

<script>
import ExpandedTagEntry from '@/components/ExpandedTagEntry.vue';
import MiscellaneousTags from '@/components/MiscellaneousTags.vue';
export default {
    name: "Calendar",
    components: {
        ExpandedTagEntry,
        MiscellaneousTags,
    },
}
</script>