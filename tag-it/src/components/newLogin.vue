<template>
    <div style="text-align: center">
        <div id="firebaseui-auth-container"></div>
    </div>
</template>

<script>
// import firebase from "@/uifire.js";
import "firebase/compat/auth";
// import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css";

export default {
    name: "newLogin",
    mounted() {
        //Calling the ui instance
        var ui = firebaseui.auth.AuthUI.getInstance();
        if (lui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        var uiConfig = {
            signInSuccessUrl: "/home",
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
        };
        ui.start("#firebaseui-auth-container", uiConfig);
    },
};
</script>
