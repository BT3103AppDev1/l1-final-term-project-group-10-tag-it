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
      password: '',
      oobCode: '',
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.oobCode = urlParams.get('oobCode');
  },
  methods: {
    resetPassword() {
      const auth = getAuth();
      confirmPasswordReset(auth, this.oobCode, this.password)
        .then(() => {
          alert('Password reset successful');
          console.log('Password reset successful');
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Error resetting password:', error);
          alert('Invalid Password');
        });
    }
  }
};
</script>