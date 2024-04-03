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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    name: "Login",

    data() {
        return {
            errorMessage: "",
        };
    },

    mounted() {
        // async function hideLoginError() {
        //     const divLoginError = document.querySelector("#divLoginError");
        //     const lblLoginErrorMessage = document.querySelector(
        //         "#lblLoginErrorMessage"
        //     );
        //     divLoginError.style.display = "none";
        //     lblLoginErrorMessage.innerHTML = "";
        // }

        // hideLoginError();
        const divLoginError = document.querySelector("#divLoginError");
        const lblLoginErrorMessage = document.querySelector(
            "#lblLoginErrorMessage"
        );
        divLoginError.style.display = "none";
        lblLoginErrorMessage.innerHTML = "";

        async function monitorAuthState() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log(user);
                    // hideLoginError();
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
                this.errorMessage = error.message;
            }
        },

        // // OLD IMPLEMENTATION (WITHOUT PROMISE)
        // async loginEmailPassword() {
        //     const loginEmail = document.getElementById("inputEmail").value;
        //     const loginPassword =
        //         document.getElementById("inputPassword").value;
        //     try {
        //         const userCredential = await signInWithEmailAndPassword(
        //             auth,
        //             loginEmail,
        //             loginPassword
        //         );
        //     } catch (error) {
        //         this.showLoginError(error);
        //     }
        // },

        async loginEmailPassword() {
            return new Promise((resolve, reject) => {
                const loginEmail = document.getElementById("inputEmail").value;
                const loginPassword =
                    document.getElementById("inputPassword").value;

                signInWithEmailAndPassword(auth, loginEmail, loginPassword)
                    .then((userCredential) => {
                        resolve(userCredential);
                    })
                    .catch((error) => {
                        this.showLoginError(error);
                        reject(error);
                    });
            });
        },

        async loginToast() {
            toast.promise(this.loginEmailPassword(), {
                pending: "Logging in...",
                success: "Successfully logged in!",
                error: "Failed to log in",
            });
        },

        // // OLD IMPLEMENTATION (without PROMISE)
        // async googleLogin() {
        //     console.log("logging in with google");
        //     const provider = new GoogleAuthProvider();
        //     return signInWithPopup(auth, provider);
        // },

        async googleLogin() {
            return new Promise((resolve, reject) => {
                const provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider)
                    .then((userCredential) => {
                        resolve(userCredential);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        async googleLoginToast() {
            toast.promise(this.googleLogin(), {
                pending: "Logging in...",
                success: "Successfully logged in!",
                error: "Failed to log in",
            });
        },

        goToSignUp() {
            router.push({ name: "SignUp" });
        },

        goToForgotPassword() {
            router.push({ name: "ForgotPassword" });
        },
    },
};
</script>

<template>
    <div class="myContainer">
        <div class="myContainer" id="testC">
            <img src="../assets/tagit3.png" width="50%" alt="tag it logo" />
            <h3>Tag-IT, don't forget it!</h3>
        </div>
        <div class="myContainer">
            <div id="loginContainer" class="curvedRectangle">
                <br />
                <div class="header2">WELCOME BACK TO</div>
                <div class="header1">Tag-IT</div>
                <br />
                <form>
                    <input
                        class="loginInput"
                        type="text"
                        placeholder="Email"
                        id="inputEmail"
                        required="yes"
                        @keyup.enter="loginToast"
                    /><br />

                    <input
                        class="loginInput"
                        type="password"
                        placeholder="Password"
                        id="inputPassword"
                        required="yes"
                        @keyup.enter="loginToast"
                    /><br />
                    <div id="divLoginError">
                        <div id="lblLoginErrorMessage" class="errorlabel">
                            ERROR: {{ this.errorMessage }}
                        </div>
                    </div>
                    <div @click="goToForgotPassword" class="clickable">
                        Forget password?
                    </div>
                    <br />

                    <button
                        id="loginButton"
                        class="blueButton"
                        type="button"
                        v-on:click="loginToast()"
                    >
                        LOGIN
                    </button>
                </form>
                <br />

                <button
                    id="googleLoginButton"
                    type="button"
                    v-on:click="googleLoginToast"
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

<style scoped>
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

.loginInput {
    height: 2.5em;
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
