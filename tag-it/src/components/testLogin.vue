<script>
export default {
    name: "testLogin",
};

// console.log(import.meta.env.VITE_APP_CREATOR);
// console.log(import.meta.env.apiKey);
</script>

<template>
    <h3>this is a testlogin page</h3>
    <div class="container">
        <div class="container" id="testC">
            <img src="../assets/tagit3.png" width="50%" alt="tag it logo" />
            <h3>Tag-IT, don't forget it!</h3>
        </div>
        <div class="container">
            <div id="loginContainer">
                <h2>WELCOME BACK TO</h2>
                <h1>Tag-IT</h1>
                <form>
                    <input
                        type="text"
                        placeholder="Email"
                        id="email"
                        required="yes"
                    /><br />

                    <input
                        type="text"
                        placeholder="Password"
                        id="password"
                        required="yes"
                    /><br />
                    Forget password?
                    <br /><br />

                    <button id="loginButton" type="button" onclick="login()">
                        LOGIN</button
                    ><br /><br />
                </form>
                Don't have an account?<br />
                Sign up here
            </div>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    width: 100%;
    align-items: center;
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
    background-color: #f2f2f2;
    color: #686868;
    filter: drop-shadow(2px 2px);
    border-radius: 25px;
    padding: 10px;
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
}

#loginButton {
    width: 190px;
    height: 30px;
    background-color: #406cbe;
    border-radius: 10px;
    color: white;
}
</style>
