import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login/register UI that stores JWT on success. */
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const payload =
        mode === "login"
          ? { email, password }
          : { email, password, display_name: displayName || email.split("@")[0] };

      const res = mode === "login" ? await api.login(payload) : await api.register(payload);
      loginWithToken(res.access_token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed");
      setStatus("error");
    }
  }

  return (
    <div className="page page--narrow">
      <h1 className="h1">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p className="subtle">{mode === "login" ? "Welcome back." : "Save favorites and rate recipes."}</p>

      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Email
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        {mode === "register" ? (
          <label className="label">
            Display name
            <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
        ) : null}

        <label className="label">
          Password
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <button className="btn btn--primary" disabled={status === "loading"} type="submit">
          {status === "loading" ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setError("");
            setStatus("idle");
            setMode((m) => (m === "login" ? "register" : "login"));
          }}
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
