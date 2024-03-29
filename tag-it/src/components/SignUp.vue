<template>
    here is the sign up page
    <div class="container">
        <div id="signupPage" class="curvedRectangle">
            <h2>SIGN UP WITH</h2>
            <h1>Tag-IT</h1>

            <div id="signupContainer">
                <button @click="goBack" class="closeButton">X</button>
                <form id="signupForm">
                    <div class="grid-container">
                        <div class="form-group">
                            <label for="signupEmail">Email: </label><br />
                            <input
                                type="text"
                                placeholder="Email"
                                id="signupEmail"
                                required="yes"
                            />
                        </div>

                        <div class="form-group">
                            <label for="signupUsername">Username: </label><br />
                            <input
                                type="text"
                                placeholder="Username"
                                id="signupUsername"
                                required="yes"
                            /><br />
                            <div class="footnote">
                                Your username must be unique with only letters
                                and numbers
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signupPassword1">Password: </label
                            ><br />
                            <input
                                type="password"
                                placeholder="Password"
                                id="signupPassword1"
                                required="yes"
                            />
                            <div class="footnote">
                                Your password must contain a minimum of 8
                                characters with no spaces with at least 1
                                uppercase, 1 lowercase and 1 number
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="signupPassword2"
                                >Confirm Password: </label
                            ><br />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                id="signupPassword2"
                                required="yes"
                            /><br />
                        </div>
                    </div>

                    <div>
                        <button
                            id="signupButton"
                            class="blueButton"
                            type="button"
                            v-on:click="createAccount"
                        >
                            SIGN UP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import router from "../router/index.js";
import { auth } from "../firebase.js";

export default {
    name: "SignUp",
    methods: {
        goBack() {
            // Using Vue Router to go back to the previous page
            router.go(-1);
        },
        async createAccount() {
            // STEP 1: CHECK IF EMAIL / USERNAME TAKEN!
            // STEP 2: CHECK IF PASSWORD MATCHES [ done ]
            // STEP 3: CHECK IF PASSWORD MATCHES CRITERIA

            const loginPassword =
                document.getElementById("signupPassword").value;
            const loginPassword2 =
                document.getElementById("signupPassword2").value;

            // if (loginPassword == loginPassword2) {
            if (true) {
                console.log("signing up!");
                const loginEmail = document.getElementById("signupEmail").value;

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    loginEmail,
                    loginPassword
                ); // will also login if successful!
                console.log(userCredential.user); // remove this line
            } else {
                // throw error here!
                console.log("password does not match!!");
            }
        },
    },
};
</script>

<style>
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-template-columns: 1fr; */
    gap: 10px;
    margin: 10px auto;
}

.footnote {
    font-size: italic;
    font-size: 12px;
}
.form-group {
    margin-bottom: 15px;
    /* grid-column: 1 / -1; */
}

#signupPage {
    padding: 3%;
    vertical-align: middle;
    display: inline-block;
}
#signupContainer {
    max-width: 800px;
    /* padding: 20px; */
    margin: auto;
}

#signupForm {
    /* display: flex; */
    width: 100%;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
}

#signupPage {
    width: 80%;
}

#signupButton {
    width: 30%;
}

input {
    height: 30px;
    margin-left: 10px;
    width: 80%;
    text-align: left;
    margin-bottom: 10px;
    border-radius: 10px;
    border-width: 2px;
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
