
import React, { useState } from "react";
import "./Signin.css";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { redirectByRole } from "../utils/redirectByRole";

function Signin() {
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

    // Step 1: Validate email.
    if (step === 1) {
      if (!email.trim()) {
        setError("Enter your email address.");
        return;
      }

      setStep(2);
      return;
    }

    // Step 2: Validate password.
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

    const credentials = {
      email: email.trim(),
      password,
      rememberMe,
    };

    try {
      let response;
      let data = {};

      // First, check whether the credentials belong to the admin.
      const adminResponse = await fetch(
        "http://localhost:5000/api/admin-auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      const adminData = await adminResponse.json().catch(() => ({}));

      if (adminResponse.ok && adminData.token && adminData.user?.role === "admin") {
        // Admin login successful.
        localStorage.setItem("adminToken", adminData.token);
        localStorage.setItem("token", adminData.token);
        localStorage.setItem("user", JSON.stringify(adminData.user));

        navigate("/admindashboard", { replace: true });
        return;
      }

      // Only fall back to regular login when admin authentication
      // returns invalid credentials (401). Do not hide server errors.
      if (adminResponse.status !== 401) {
        setError(
          adminData.message ||
            "Admin authentication failed. Please try again."
        );
        return;
      }

      // If this isn't the admin account, try regular user sign-in.
      response = await fetch(
        "http://localhost:5000/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      const user = data.user;

      if (!user) {
        setError(
          "The server did not return a valid user account. Please check your authentication API."
        );
        return;
      }

      if (user.role === "admin") {
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admindashboard", { replace: true });
        return;
      }

      // Regular user login successful.
      localStorage.removeItem("adminToken");

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("token");
      }

      localStorage.setItem("user", JSON.stringify(user));

      redirectByRole(user.role, navigate);
    } catch (err) {
      console.error("Sign-in error:", err);

      setError(
        "Cannot connect to the server. Make sure your backend is running on port 5000."
      );
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
                  Email Address
                </label>

                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  autoFocus
                  disabled={loading || step === 2}
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

            {step === 2 && (
              <button
                type="button"
                className="signin-back-button"
                onClick={() => {
                  setStep(1);
                  setPassword("");
                  setError("");
                }}
                disabled={loading}
              >
                Use a different email
              </button>
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
            <Link to="/forgot-password">
              Forgot password? ↗
            </Link>

            <p>
              Don’t have an account?{" "}
              <Link to="/signup">
                Create Your Account ↗
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Signin;
