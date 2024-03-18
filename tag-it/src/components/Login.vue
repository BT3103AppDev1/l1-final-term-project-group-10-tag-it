<script>
import {
    // GoogleAuthProvider,
    // signInWithPopup,
    // getAuth,
    signInWithEmailAndPassword,
    AuthErrorCodes,
} from "firebase/auth";

import { auth } from "../firebase.js";

export default {
    name: "Login",

    mounted() {
        console.log("mounted!");
        async function hideLoginError() {
            console.log("hiding");
            const divLoginError = document.querySelector("#divLoginError");
            const lblLoginErrorMessage = document.querySelector(
                "#lblLoginErrorMessage"
            );
            divLoginError.style.display = "none";
            lblLoginErrorMessage.innerHTML = "";
        }

        hideLoginError();
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
                console.log(error);
                // divLoginError.style.display = "block";
                // if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                //     lblLoginErrorMessage.innerHTML =
                //         "Wrong password. Try again";
                // } else {
                //     lblLoginErrorMessage.innerHTML = "Error: ${error.message}";
                // }
                // // showLoginError(error);
            }
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
                            Error message
                        </div>
                    </div>
                    Forget password?
                    <br /><br />

                    <button
                        id="loginButton"
                        type="button"
                        v-on:click="loginEmailPassword"
                    >
                        LOGIN</button
                    ><br /><br />
                    <button
                        id="googleLoginButton"
                        type="button"
                        v-on:click="googleLogin"
                    >
                        LOGIN WITH GOOGLE</button
                    ><br /><br />
                    Don't have an account?<br />
                    Sign up here
                </form>
            </div>
        </div>
    </div>
</template>

<style>
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

#loginButton {
    width: 190px;
    height: 35px;
    background-color: #406cbe;
    border-radius: 10px;
    border-width: 2px;
    color: white;
    font-size: medium;
}

#googleLoginButton {
    background-color: white;
    height: 35px;
    width: 250px;
    border-radius: 10px;
}

.errorlabel {
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    -webkit-appearance: none;
    display: block;
    background: #fafafa;
    color: #ff0000;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #ff0000;
}
</style>
