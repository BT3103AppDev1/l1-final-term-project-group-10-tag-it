<template>
  <div id="passwordContainer">
    <div id="passwordPage">RESET PASSWORD</div>
    <div id="passwordMessage">Please enter your new password</div>
    <form @submit.prevent="resetPassword">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
      <button id="passwordButton" type="submit">Reset password</button>
    </form>
  </div>
</template>

<script>
import { getAuth, confirmPasswordReset } from "firebase/auth";

export default {
  data() {
    return {
      password: "",
      oobCode: "",
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.oobCode = urlParams.get("oobCode");
  },
  methods: {
    resetPassword() {
      const auth = getAuth();
      confirmPasswordReset(auth, this.oobCode, this.password)
        .then(() => {
          alert("Password reset successful");
          console.log("Password reset successful");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error resetting password:", error);
          alert("Invalid Password");
        });
    },
  },
};
</script>

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

#password {
  font-size: medium;
  text-align: left;
  width: 50%;
  margin-right: 14%;
  font-family: cabin;
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
</style>