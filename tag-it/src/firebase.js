import { initializeApp } from "firebase/app";
// require("dotenv").config();

// import {
//     getAuth,
//     connectAuthEmulator,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     onAuthStateChanged,
//     signOut,
// } from "firebase/auth";

// const firebaseConfig = {
//     // stuffs here
//     apiKey: keys.env.apiKey,
//     authDomain: keys.env.authDomain,
//     projectId: keys.env.projectId,
//     storageBucket: keys.env.storageBucket,
//     messagingSenderId: keys.env.messagingSenderId,
//     appId: keys.env.appId,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

// export default firebaseApp;

// connectAuthEmulator(auth, "http://localhost:9099");

// const loginEmailPassword = async () => {
//     const loginEmail = txtEmail.value;
//     const loginPassowrd = txtPassword.value;

//     const userCredential = await signInWithEmailAndPassword(
//         auth,
//         loginEmail,
//         loginPassowrd
//     );
//     console.log(userCredential.user); // remove this line
// };

// const createAccount = async () => {
//     const loginEmail = txtEmail.value;
//     const loginPassowrd = txtPassword.value;

//     const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         loginEmail,
//         loginPassowrd
//     );
// };

// const monitorAuthState = async() => {
//     onAuthStateChanged(auth, user => {
//         if (user) => {
//             console.log(user)
//             showApp();
//             showLoginState(user);

//             hideLoginError();
//         }
//         else {
//             showLoginForm();
//             //lblAuthState.innterHTML = "You're not logged in"
//         }
//     })
// }

// const logout = async() => {
//     await signOut(auth);
// }

// btnLogout.addEventListener("click", logout);
