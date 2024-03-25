<template>
  <div id="passwordContainer" v-if="validToken">
    <div id="passwordPage">RESET PASSWORD</div>
    <div id="passwordMessage">Please enter your new password</div>
    <form @submit.prevent="resetPassword">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
      <button id="passwordButton" type="submit">Reset password</button>
    </form>
  </div>
  <div v-else>
    <p>Invalid or expired reset link.</p>
  </div>
</template>

<script>
import { getAuth, confirmPasswordReset } from "firebase/auth";

export default {
  data() {
    return {
      password: '',
      oobCode: '',
      validToken: false
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.oobCode = urlParams.get('oobCode');
    this.validateResetToken();
  },
  methods: {
    validateResetToken() {
      if (this.oobCode) {
        this.validToken = true;
      }
    },
    resetPassword() {
      if (!this.validToken) {
        return;
      }
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
