import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
    // apiKey: import.meta.env.VITE_apiKey,
    // authDomain: import.meta.env.VITE_authDomain,
    // projectId: import.meta.env.VITE_projectId,
    // storageBucket: import.meta.env.VITE_storageBucket,
    // messagingSenderId: import.meta.env.VITE_messagingSenderId,
    // appId: import.meta.env.VITE_appId,

    apiKey: "AIzaSyA0lXYWoub3hGzRaHdHUj0xXqx0kE7OmxA",
    authDomain: "tagit-38422.firebaseapp.com",
    projectId: "tagit-38422",
    storageBucket: "tagit-38422.appspot.com",
    messagingSenderId: "261352745700",
    appId: "1:261352745700:web:f940ce49ccf2d6346b5af1",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export default firebaseApp;
