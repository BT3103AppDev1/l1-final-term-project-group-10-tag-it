<script>
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";

  export default {
    data() {
      return {
        email: "",
      };
    },
    methods: {
      sendPasswordReset() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.email)
        .then(() => {
          alert("Reset Password Email Sent!");
          this.$router.push('/');
        })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            if (errorCode === "auth/invalid-email") {
              alert("Invalid Email Address");
            } else {
              alert("An error occurred. Please try again later.");
            }
          });
      },
    },
  };
</script>

<template>
  <div id="passwordContainer">
    <div id="passwordPage">FORGOTTEN PASSWORD?</div>
    <div id="passwordMessage">Please enter your registered email with TAG-IT</div>
    <form @submit.prevent="sendPasswordReset">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
      <button id="passwordButton" type="submit">Send Reset Email</button>
    </form>
  </div>
</template>

<style>
  #passwordContainer {
    text-align: center;
    background-color: #f2f2f2;
    border-radius: 10px;
    width: 30%;
    padding: 2%;
    margin: auto;
    margin-top: 15%;
    margin-bottom: 15%;
    box-shadow: 0px 3px #c9c9c9;
  }

  #passwordPage {
    margin-top: 1%;
    margin-bottom: 1%;
    font-size: x-large;
  }

  #passwordMessage {
    margin-top: 1px;
    color: #646e80;
  }

  label {
    font-size: large;
    color: #646e80;
  }

  #email {
    font-size: medium;
    text-align: center;
  }

  #passwordButton {
    background-color: #406cbe;
    color: white;
    display: flex;
    margin: auto;
    margin-top: 5%;
    border-radius: 5px;
    padding: 10px 15px;
  }

  #passwordButton:hover {
    background-color: white;
    color: #406cbe;
    cursor: pointer;
  }
</style>