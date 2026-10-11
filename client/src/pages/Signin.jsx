
import React, { useState } from "react";
import "./Signin.css";
import Navbar  from "../components/Navbar";
import { useNavigate } from "react-router-dom";


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!email.trim()) {
        setError("Enter your email address or phone number.");
        return;
      }

      setStep(2);
      return;
    }

    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // The backend must verify the user and return their role.
      const role = data.user?.role;

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "user") {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Your account role is not recognized.");
      }
    } catch (err) {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="apple-signin-page">
        <h1 className="signin-main-title">
          Sign in for faster checkout.
        </h1>

        <section className="signin-content">
          <h2>Sign in to Apple Store</h2>

          <form
            className={`signin-form ${
              step === 2 ? "signin-form-password" : ""
            }`}
            onSubmit={handleContinue}
          >
            <div className="signin-fields">
              <div className="signin-field">
                <label htmlFor="signin-email">
                  Email or Phone Number
                </label>

                <input
                  id="signin-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>

              {step === 2 && (
                <div className="signin-field signin-password-field">
                  <label htmlFor="signin-password">
                    Password
                  </label>

                  <input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>
              )}

              <button
                className="signin-arrow"
                type="submit"
                disabled={loading}
                aria-label={step === 1 ? "Continue" : "Sign in"}
              >
                <span aria-hidden="true">
                  {loading ? "…" : "➜"}
                </span>
              </button>
            </div>

            {error && (
              <p className="signin-error" role="alert">
                {error}
              </p>
            )}
          </form>

          <label className="signin-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <div className="signin-bottom-links">
            <a href="/forgot-password">
              Forgot password? ↗
            </a>

            <p>
              Don’t have an account?{" "}
              <a href="/create-account">
                Create Your Account ↗
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default SignIn;