<script>
import {
    // GoogleAuthProvider,
    // signInWithPopup,
    // getAuth,
    signInWithEmailAndPassword,
    AuthErrorCodes,
    onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase.js";

export default {
    name: "Login",

    data() {
        return {};
    },

    mounted() {
        async function hideLoginError() {
            console.log("hiding");

            // const divLoginError = document.querySelector("#divLoginError");
            // const lblLoginErrorMessage = document.querySelector(
            //     "#lblLoginErrorMessage"
            // );
            divLoginError.style.display = "none";
            lblLoginErrorMessage.innerHTML = "";
        }

        // async function hideLoginError() {
        //     console.log("hiding");
        //     this.showLoginError = false;
        //     this.loginErrorMessage = "";
        // }

        hideLoginError();

        async function monitorAuthState() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log(user);
                    // showApp();
                    // showLoginState();

                    // hideLoginError();
                } else {
                    console.log("You're not logged in");
                    // showLoginForm();
                    // lnlAuthState.innerHTML = "You're not logged in"
                }
            });
        }

        monitorAuthState();

        async function showLoginError(error) {
            console.log(error);

            const divLoginError = document.querySelector("#divLoginError");
            const lblLoginErrorMessage = document.querySelector(
                "#lblLoginErrorMessage"
            );

            divLoginError.style.display = "block";

            if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                lblLoginErrorMessage.innerHTML = "Wrong Password. Try Again!";
            } else {
                lblLoginErrorMessage.innerHTML = "Error: ${error.message}";
            }
        }
    },
    methods: {
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
                // console.log(error);
                // divLoginError.style.display = "block";
                // if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                //     lblLoginErrorMessage.innerHTML =
                //         "Wrong password. Try again";
                // } else {
                //     lblLoginErrorMessage.innerHTML = "Error: ${error.message}";
                // }
                showLoginError(error);
            }
        },

        showLoginError(error) {
            console.log("method works!!");
            // console.log(error);
            this.showLoginError = true;
            this.loginErrorMessage = "Error: ${error.message}";
        },
    },
    // methods: {
    //     async googleLogin() {
    //         const provider = new GoogleAuthProvider();
    //         return signInWithPopup(auth, provider);
    //     },
    // },
};
</script>

<template>
    <h3>this is a testlogin page</h3>
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
                    /><br />

                    <input
                        type="password"
                        placeholder="Password"
                        id="inputPassword"
                        required="yes"
                    /><br />
                    <div id="divLoginError">
                        <div id="lblLoginErrorMessage" class="errorlabel">
                            ERROR MESSAGE
                        </div>
                    </div>
                    Forget password?
                    <br /><br />

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
                Sign up here
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
    /* background-color: #1f497d; */
    height: 100%;
}

#loginContainer {
    /* background-color: #f2f2f2;
    color: #686868;
    filter: drop-shadow(2px 2px);
    border-radius: 25px;
    padding: 20px; */
    width: 50%;
}

form {
    text-align: center;
}

input {
    height: 30px;
    margin-left: 10px;
    width: 250px;
    text-align: left;
    margin-bottom: 10px;
    border-radius: 10px;
    border-width: 2px;
}

#googleLoginButton {
    background-color: white;
    height: 35px;
    width: 250px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
}

.errorlabel {
    font-size: 18px;
    padding: 10px;
    display: block;
    /* background: #fafafa; */
    color: #ff0000;
    /* width: 100%; */
    border: none;
    border-radius: 0;
    /* border-bottom: 1px solid #ff0000; */
}

button {
    vertical-align: middle;
    /* align-items: center;
    justify-content: center; */
    /* display: flex; */
}
</style>
