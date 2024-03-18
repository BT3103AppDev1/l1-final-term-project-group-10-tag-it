import { initializeApp } from "firebase/app";
require("dotenv").config();

const firebaseConfig = {
    // stuffs here
    apiKey: keys.env.apiKey,
    authDomain: keys.env.authDomain,
    projectId: keys.env.projectId,
    storageBucket: keys.env.storageBucket,
    messagingSenderId: keys.env.messagingSenderId,
    appId: keys.env.appId,
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
