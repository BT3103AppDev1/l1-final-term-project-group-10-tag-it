<script>
import {
    signInWithEmailAndPassword,
    AuthErrorCodes,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase.js";
import router from "../router/index.js";

export default {
    name: "Login",

    data() {
        return {
            errorMessage: "",
        };
    },

    mounted() {
        async function hideLoginError() {
            const divLoginError = document.querySelector("#divLoginError");
            const lblLoginErrorMessage = document.querySelector(
                "#lblLoginErrorMessage"
            );
            divLoginError.style.display = "none";
            lblLoginErrorMessage.innerHTML = "";
        }

        hideLoginError();

        async function monitorAuthState() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log(user);
                    // showApp();
                    // showLoginState();
                    hideLoginError();
                    router.push({ name: "Home" });
                }
            });
        }

        monitorAuthState();
    },
    methods: {
        async showLoginError(error) {
            const divLoginError = document.querySelector("#divLoginError");
            const lblLoginErrorMessage = document.querySelector(
                "#lblLoginErrorMessage"
            );

            divLoginError.style.display = "block";

            if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                lblLoginErrorMessage.innerHTML = "Wrong Password. Try Again!";
            } else {
                console.log(error);
                console.log(error.message);
                this.errorMessage = error.message;
            }
        },

        async loginEmailPassword() {
            console.log("logging in");
            const loginEmail = document.getElementById("inputEmail").value;
            const loginPassword =
                document.getElementById("inputPassword").value;
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    loginEmail,
                    loginPassword
                );
                console.log(userCredential.user); // remove this line
            } catch (error) {
                console.log("CAUGHT ERROR!");
                this.showLoginError(error);
            }
        },

        async googleLogin() {
            console.log("logging in with google");
            const provider = await new GoogleAuthProvider();
            return signInWithPopup(auth, provider);
        },

        goToSignUp() {
            router.push({ name: "SignUp" });
        },
    },
};
</script>

<template>
    <div class="container">
        <div class="container" id="testC">
            <img src="../assets/tagit3.png" width="50%" alt="tag it logo" />
            <h3>Tag-IT, don't forget it!</h3>
        </div>
        <div class="container">
            <div id="loginContainer" class="curvedRectangle">
                <br />
                <h2>WELCOME BACK TO</h2>
                <h1>Tag-IT</h1>
                <br />
                <form>
                    <input
                        type="text"
                        placeholder="Email"
                        id="inputEmail"
                        required="yes"
                        @keyup.enter="loginEmailPassword"
                    /><br />

                    <input
                        type="password"
                        placeholder="Password"
                        id="inputPassword"
                        required="yes"
                        @keyup.enter="loginEmailPassword"
                    /><br />
                    <div id="divLoginError">
                        <div id="lblLoginErrorMessage" class="errorlabel">
                            ERROR: {{ this.errorMessage }}
                        </div>
                    </div>
                    <div @click="goToSignUp" class="clickable">
                        Forget password?
                    </div>
                    <br />

                    <button
                        id="loginButton"
                        class="blueButton"
                        type="button"
                        v-on:click="loginEmailPassword"
                    >
                        LOGIN
                    </button>
                </form>
                <br />

                <button
                    id="googleLoginButton"
                    type="button"
                    v-on:click="googleLogin"
                >
                    <span>
                        <img
                            class="icon"
                            alt=""
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        />
                    </span>
                    <span> LOGIN WITH GOOGLE</span></button
                ><br /><br />

                Don't have an account?<br />
                <div @click="goToSignUp" class="clickable">Sign up here</div>
            </div>
        </div>
    </div>
</template>

<style>
.icon {
    border: none;
    height: 18px;
    vertical-align: middle;
}
#testC {
    display: inline;
    width: 100%;
    padding: 10px;
    border-radius: 25px;
    height: 100%;
}

#loginContainer {
    width: 50%;
}

form {
    text-align: center;
}

input {
    height: 30px;
    margin-left: 10px;
    width: 75%;
    text-align: left;
    margin-bottom: 10px;
    border-radius: 10px;
    border-width: 2px;
}

#googleLoginButton {
    background-color: white;
    padding: 5px;
    width: 75%;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.errorlabel {
    font-size: 18px;
    padding: 10px;
    display: block;
    color: #ff0000;
    border: none;
    border-radius: 0;
}

button {
    cursor: pointer;
    vertical-align: middle;
}

.clickable {
    cursor: pointer;
}
</style>
