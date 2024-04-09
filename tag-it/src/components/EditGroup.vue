<template>
  <div class="modal" v-if="showPopup">
    <div class="modal-content">
      <button id="closeButton" @click="closePopup">
        <img src="../assets/close.png" width="12" />
      </button>
      <h2>{{ calendarData.calendar_name }}</h2>
      <p>Number of Members: {{ calendarData.users.length }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: {
      type: Boolean,
      required: true,
    },
    calendarData: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    }
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
}

.modal-content {
  background-color: #f2f2f2;
  margin: auto;
  width: 50%;
  height: 60%;
  border-radius: 20px;
}

h2 {
  font-size: x-large;
}

#closeButton {
  padding: 0;
  border: none;
  background: none;
  margin-top: 9px;
  margin-left: 9px;
  width: 3%;
  height: 6%;
  border-radius: 8px;
}

</style>