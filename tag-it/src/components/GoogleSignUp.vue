<template>
    <div class="myContainer">
        <div id="signupPage" class="curvedRectangle">
            <div class="header2">SIGN UP WITH</div>
            <div class="header1">Tag-IT</div>

            <div id="signupContainer">
                <form id="signupForm">
                    <div class="grid-container">
                        <div class="form-group">
                            <label for="firstName">First Name: </label><br />
                            <input
                                class="signUpInput"
                                type="text"
                                v-model="loggedName"
                                placeholder="First Name"
                                id="signUpFirstName"
                                required="yes"
                            />
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name: </label><br />
                            <input
                                class="signUpInput"
                                type="text"
                                placeholder="Last Name"
                                id="signUpLastName"
                                required="yes"
                            />
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email: </label><br />
                            <input
                                class="signUpInput"
                                type="text"
                                v-model="this.loggedEmail"
                                id="signupEmail"
                                readonly
                            />
                        </div>

                        <div class="form-group">
                            <label for="signupUsername">Username: </label><br />
                            <input
                                class="signUpInput"
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
                            <label for="signupMobile">Mobile Number: </label
                            ><br />
                            <input
                                class="signUpInput"
                                type="text"
                                placeholder="Mobile Number"
                                id="signupMobile"
                                required="yes"
                                v-model="loggedMobile"
                            />
                            <div class="footnote">
                                Valid Singapore numbers only, without Country
                                Code
                            </div>
                        </div>
                    </div>
                    <div id="signUpError">
                        <div id="signUpErrorMessage" class="errorLabel">
                            ERROR:
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
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import router from "../router/index.js";
import { auth } from "../firebase.js";
import {
    getFirestore,
    doc,
    setDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    name: "GoogleSignUp",

    data() {
        return {
            errorMessage: "",
            loggedEmail: null,
            loggedName: null,
            loggedMobile: null,
        };
    },

    mounted() {
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

        async function hideSignUpError() {
            const signUpError = document.querySelector("#signUpError");
            const signUpErrorMessage = document.querySelector(
                "#signUpErrorMessage"
            );
            signUpError.style.display = "none";
            signUpErrorMessage.innerHTML = "";
        }

        hideSignUpError();
    },

    created() {
        this.monitorAuthState();
    },

    methods: {
        monitorAuthState() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.loggedEmail = user.email;
                    this.loggedName = user.displayName;
                    this.loggedMobile = user.phoneNumber;
                }
            });
        },

        goBack() {
            // Using Vue Router to go back to the previous page
            router.go(-1);
        },

        checkProfile(signupEmail, signupUsername, signupMobile) {
            const db = getFirestore();
            const usersCollection = collection(db, "User");

            const queryByEmail = query(
                usersCollection,
                where("email", "==", signupEmail)
            );

            const queryByUsername = query(
                usersCollection,
                where("username", "==", signupUsername)
            );
            const queryByMobileNumber = query(
                usersCollection,
                where("mobile_number", "==", signupMobile)
            );

            Promise.all([
                getDocs(queryByEmail),
                getDocs(queryByUsername),
                getDocs(queryByMobileNumber),
            ])
                .then(
                    ([
                        emailSnapshot,
                        usernameSnapshot,
                        mobileNumberSnapshot,
                    ]) => {
                        if (!emailSnapshot.empty) {
                            this.addError("Email already exists!");
                        }
                        if (!usernameSnapshot.empty) {
                            this.addError("Username already exists!");
                        }
                        if (!mobileNumberSnapshot.empty) {
                            this.addError("Mobile number already exists!");
                        }
                    }
                )
                .catch((error) => {
                    console.error("Error querying database: ", error);
                });
        },

        checkPassword(pw) {
            return (
                /[A-Z]/.test(pw) &&
                /[a-z]/.test(pw) &&
                /[0-9]/.test(pw) &&
                /[^A-Za-z0-9]/.test(pw) &&
                pw.length > 8
            );
        },

        async createAccount() {
            const signUpErrorMessage = document.querySelector(
                "#signUpErrorMessage"
            );
            signUpErrorMessage.innerHTML = "";

            // STEP 1: Check if a) email b) username c) mobile number has been taken
            const signupEmail = document.getElementById("signupEmail").value;
            const signupUsername = document
                .getElementById("signupUsername")
                .value.toLowerCase();
            const signupMobile = document.getElementById("signupMobile").value;

            this.checkProfile(signupEmail, signupUsername, signupMobile);

            // STEP 2c: Check if Mobile Number is valid
            var regEx = /^[0-9]{8}$/;
            if (!regEx.test(signupMobile)) {
                this.addError("Please enter a valid SG mobile number.");
            }

            // // CHECK IF ERROR
            toast.promise(this.populateProfile(), {
                pending: "Signing up...",
                success: "Successfully signed up & logged in!",
                error: "Failed to sign up",
            });
        },

        async populateProfile() {
            return new Promise(async (resolve, reject) => {
                try {
                    // console.log(signUpErrorMessage.innerHTML);
                    if (signUpErrorMessage.innerHTML !== "") {
                        this.showSignUpError();
                        reject();
                    } else {
                        const signupEmail =
                            document.getElementById("signupEmail").value;
                        const signupUsername =
                            document.getElementById("signupUsername").value;
                        const signupMobile =
                            document.getElementById("signupMobile").value;
                        const firstName =
                            document.getElementById("signUpFirstName").value;
                        const lastName =
                            document.getElementById("signUpLastName").value;

                        // await createUserWithEmailAndPassword(
                        //     auth,
                        //     signupEmail,
                        //     loginPassword
                        // );
                        await this.createProfile(
                            firstName,
                            lastName,
                            signupUsername,
                            signupEmail,
                            signupMobile
                        );
                        router.push({ name: "Home" });
                        resolve();
                    }
                } catch (error) {
                    this.showSignUpError();
                    reject(error);
                }
            });
        },

        addError(error) {
            const signUpErrorMessage = document.querySelector(
                "#signUpErrorMessage"
            );

            if (typeof error == "string") {
                signUpErrorMessage.innerHTML =
                    signUpErrorMessage.innerHTML + error + "<br>";
            }
        },

        // UPDATED showSignUpError (in work in conjuction with addError)
        showSignUpError() {
            const signUpError = document.querySelector("#signUpError");
            signUpError.style.display = "block";
        },

        async createProfile(
            firstName,
            lastName,
            username,
            email,
            mobileNumber
        ) {
            const db = getFirestore();
            const user = auth.currentUser;
            const userDocRef = doc(db, "User", user.uid);

            const miscDocRef = await addDoc(collection(db, "Calendar"), {
                calendar_name: "",
                color: "#cccaca",
                tags: [],
                users: [user.uid],
            });

            const newUserData = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                mobile_number: mobileNumber,
                misc_calendar: String(miscDocRef.id),
                personal_calendars: {},
                shared_calendars: {},
            };

            setDoc(userDocRef, newUserData);
        },
    },
};
</script>

<style scoped>
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

.signUpInput {
    height: 2.5em;
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

.errorLabel {
    font-size: 18px;
    padding: 10px;
    display: block;
    color: #ff0000;
    border: none;
    border-radius: 0;
}
</style>
