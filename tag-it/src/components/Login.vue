<template>
    <div id="loginLeft" class="column"></div>

    <div id="loginRight" class="column">
        <div id="login">
            <div class="header">
                <h1>Getting Started with Firebase Auth</h1>
            </div>
            <form>
                <div class="group">
                    <input id="txtEmail" type="email" />
                    <label>Email</label>
                </div>
                <div class="group">
                    <input id="txtPassword" type="password" />
                    <label>Password</label>
                </div>
                <div id="divLoginError" class="group">
                    <div id="lblLoginErrorMessage" class="errorlabel">
                        Error message
                    </div>
                </div>
                <button id="btnLogin" type="button" class="button buttonBlue">
                    Log in
                </button>
                <button id="btnSignup" type="button" class="button buttonBlue">
                    Sign up
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    name: "Login",
};
</script>

<style>
.column {
    float: left;
    width: 50%;
}
.row:after {
    content: "";
    display: table;
    clear: both;
}
</style>
