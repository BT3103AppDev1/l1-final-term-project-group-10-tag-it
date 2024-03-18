import { initializeApp } from "firebase/app";

// import {
//     getAuth,
//     connectAuthEmulator,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     onAuthStateChanged,
//     signOut,
// } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
};

const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

export default firebaseApp;

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
