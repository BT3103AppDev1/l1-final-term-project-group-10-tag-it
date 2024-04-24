<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import router from "../router/index.js";

export default {
    name: "ForgetPassword",

    data() {
        return {
            email: "",
        };
    },
    methods: {
        goBack() {
            router.go(-1);
        },

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
    <div class="myContainer" id="forgetPassword">
        <div class="curvedRectangle" id="passwordContainer">
            <button @click="goBack" class="closeButton">X</button>
            <div class="header2" id="passwordPage">FORGOTTEN PASSWORD?</div>
            <div id="passwordMessage">
                Please enter your registered email with TAG-IT
            </div>
            <form @submit.prevent="sendPasswordReset">
                <div class="inputContainer">
                    <label for="email">Email:</label>
                    <br />
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        required="yes"
                        placeholder="Email"
                    />
                </div>
                <br />
                <button class="blueButton" id="passwordButton" type="submit">
                    SEND RESET EMAIL
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
#passwordContainer {
    width: 40%;
    min-width: 25em;
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

/* label {
    font-size: large;
    color: #646e80;
    font-family: cabin;
    margin-right: 1%;
} */

#email {
    height: 2.5em;
    margin-left: 10px;
    width: 50%;
    text-align: left;
    font-family: cabin;
    margin-bottom: 10px;
    border-radius: 10px;
    border-width: 1.5px;
}

#passwordButton {
    width: 50%;
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
