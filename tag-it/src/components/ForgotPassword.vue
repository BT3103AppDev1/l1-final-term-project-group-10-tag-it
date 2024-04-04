<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  name: "ForgetPassword",

  data() {
    return {
      email: "",
    };
  },
  methods: {
    sendPasswordReset() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.email)
        .then(function () {
          alert("Reset Password Email Sent!");
          this.$router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          alert("Invalid Email Address");
        });
    },
  },
};
</script>

<template>
  <div id="passwordContainer">
    <div id="passwordPage">FORGOTTEN PASSWORD?</div>
    <div id="passwordMessage">
      Please enter your registered email with TAG-IT
    </div>
    <form @submit.prevent="sendPasswordReset">
      <div class="inputContainer">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <button id="passwordButton" type="submit">Send Reset Email</button>
    </form>
  </div>
</template>

<style scoped>
#passwordContainer {
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 10px;
  width: 40%;
  padding: 2%;
  margin: auto;
  box-shadow: 0px 3px #c9c9c9;
  font-family: cabin;
}

#passwordPage {
  margin-top: 1%;
  margin-bottom: 1%;
  font-size: x-large;
  font-family: cabin;
}

#passwordMessage {
  margin-top: 1%;
  margin-bottom: 3%;
  color: #646e80;
  font-family: cabin;
}


label {
  font-size: large;
  color: #646e80;
  font-family: cabin;
  margin-right: 1%;
}

#email {
  font-size: medium;
  text-align: left;
  width: 50%;
  font-family: cabin;
  margin-right: 9%;
}

#passwordButton {
  background-color: #406cbe;
  color: white;
  display: flex;
  margin: auto;
  margin-top: 5%;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: medium;
  font-family: cabin;
}

#passwordButton:hover {
  background-color: white;
  color: #406cbe;
  cursor: pointer;
}

.closeButton {
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 20px;
    color: #0641ad;
    padding: 15px;
}
</style>