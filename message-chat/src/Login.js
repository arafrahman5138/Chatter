import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__logo">
        <img
          src="message.png"
          alt=""
        />
        <h1>CHATTER</h1>
      </div>
      <Button onClick={signIn}>Sign In With Google <FcGoogle/></Button>
    </div>
  );
}

export default Login;
