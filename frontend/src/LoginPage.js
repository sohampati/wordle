// src/LoginPage.js
import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        alert("Verification email sent. Please verify before logging in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div style={{ maxWidth: 400, margin: "4rem auto", textAlign: "center" }}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 10, padding: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: 10, padding: 10, width: "100%" }}
        />
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          {isSignup ? "Create Account" : "Log In"}
        </button>
      </form>
      

      <button onClick={handleGoogleLogin} style={{ marginTop: 20, padding: 10, width: "100%" }}>
        Continue with Google
      </button>

      <p style={{ marginTop: 20 }}>
        {isSignup ? "Already have an account?" : "Need an account?"} {" "}
        <span
          onClick={() => setIsSignup(!isSignup)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </span>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
