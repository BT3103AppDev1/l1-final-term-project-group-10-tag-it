<script>
import {
    signInWithEmailAndPassword,
    AuthErrorCodes,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

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
        const divLoginError = document.querySelector("#divLoginError");
        const lblLoginErrorMessage = document.querySelector(
            "#lblLoginErrorMessage"
        );
        divLoginError.style.display = "none";
        lblLoginErrorMessage.innerHTML = "";

        async function monitorAuthState() {
            // check if new user or logged in before
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const loggedEmail = user.email;

                    const db = getFirestore();
                    const usersCollection = collection(db, "User");

                    const queryByEmail = query(
                        usersCollection,
                        where("email", "==", loggedEmail)
                    );

                    // checking if email has been occupied
                    Promise.all([getDocs(queryByEmail)])
                        .then(([emailSnapshot]) => {
                            if (!emailSnapshot.empty) {
                                // PROFILE CREATED --> GO TO HOME
                                router.push({ name: "Home" });
                            } else if (emailSnapshot.empty) {
                                // NO PROFILE YET --> GO TO GOOGLESIGNUP
                                router.push({ name: "GoogleSignUp" });
                            }
                        })
                        .catch((error) => {
                            console.error("Error querying database: ", error);
                        });
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
    <nav>
        <div class="container-fluid" style="height:13vh; padding-left:30px; padding-right:30px;">
        </div>
    </nav>
    <div class="myContainer" id="loginComponent">
        <div class="myContainer" id="leftSide">
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
#loginComponent {
    padding-bottom: 5em;
    vertical-align: middle;
}

.icon {
    border: none;
    height: 18px;
    vertical-align: middle;
}
#leftSide {
    display: inline;
    width: 100%;
    padding: 10px;
    border-radius: 25px;
    height: 100%;
}

#loginContainer {
    width: 50%;
    min-width: 20em;
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
    border-width: 1.5px;
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

#googleLoginButton:hover {
    background-color: #f2f2f2;
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
