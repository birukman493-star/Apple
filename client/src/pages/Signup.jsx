import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { redirectByRole } from "../utils/redirectByRole";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get("firstName")?.trim();
    const lastName = formData.get("lastName")?.trim();
    const email = formData.get("email")?.trim().toLowerCase();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!firstName || !lastName || !email || !password) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email,
            password,
            country: formData.get("country"),
            birthMonth: formData.get("birthMonth"),
            birthDay: formData.get("birthDay"),
            birthYear: formData.get("birthYear"),
            callingCode: formData.get("callingCode"),
            phone: formData.get("phone")?.trim() || null,
            announcements: formData.has("announcements"),
            appsUpdates: formData.has("appsUpdates"),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to create your account.");
      }

      // The server must return the created user and their database role.
      if (!data.user) {
        setMessage(
          "Your account may have been created. Please sign in to continue."
        );
        return;
      }

      // Never trust a role supplied by the public signup form.
      // The backend must assign the role, normally "user".
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role) {
        redirectByRole(data.user.role, navigate);
      } else {
        // Registration succeeded, but the API did not return a role.
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin", {
          state: {
            message: "Account created. Please sign in.",
            email,
          },
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      setMessage(
        error.message ||
          "Unable to create your account. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="account-demo">
        <header className="account-header">
          <h2>Account</h2>

          <nav>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Create Account</Link>
            <a href="#faq">FAQ</a>
          </nav>
        </header>

        <main className="account-main" id="create">
          <h1>Create Your Account</h1>

          <p className="account-intro">
            One account is all you need to access your services.
          </p>

          <p className="account-signin">
            Already have an account?{" "}
            <Link to="/signin">Sign In ↗</Link>
          </p>

          <form onSubmit={handleSignup}>
            <div className="account-name-row">
              <input
                name="firstName"
                aria-label="First name"
                placeholder="First Name"
                autoComplete="given-name"
                required
              />

              <input
                name="lastName"
                aria-label="Last name"
                placeholder="Last Name"
                autoComplete="family-name"
                required
              />
            </div>

            <label className="account-floating-label">
              <span>Country/Region</span>
              <select name="country" defaultValue="Ethiopia">
                <option value="Ethiopia">Ethiopia</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Kenya">Kenya</option>
              </select>
            </label>

            <label className="account-field-label">
              Birthday
            </label>

            <div className="account-birthday-row">
              <select name="birthMonth" defaultValue="">
                <option value="" disabled>Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select name="birthDay" defaultValue="">
                <option value="" disabled>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select name="birthYear" defaultValue="">
                <option value="" disabled>Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <hr />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email address"
              autoComplete="email"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              aria-label="Confirm password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <hr />

            <label className="account-floating-label">
              <span>Country calling code</span>
              <select name="callingCode" defaultValue="+251">
                <option value="+251">+251 (Ethiopia)</option>
                <option value="+1">+1 (United States)</option>
                <option value="+44">+44 (United Kingdom)</option>
                <option value="+254">+254 (Kenya)</option>
              </select>
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (optional)"
              aria-label="Phone number"
              autoComplete="tel"
            />

            <p className="account-help">
              Enter your information to create an account.
            </p>

            <hr />

            <label className="account-check-row">
              <input
                type="checkbox"
                name="announcements"
                defaultChecked
              />
              <span>
                <strong>Announcements</strong>
                <small>
                  Receive product news and service announcements.
                </small>
              </span>
            </label>

            <label className="account-check-row">
              <input
                type="checkbox"
                name="appsUpdates"
                defaultChecked
              />
              <span>
                <strong>Apps, Music, TV, and More</strong>
                <small>
                  Receive updates about apps, entertainment, and services.
                </small>
              </span>
            </label>

            <hr />

            <div className="account-demo-notice">
              <strong>Account security</strong>
              <p>
                Your account will be created through the server.
                Keep your password private.
              </p>
            </div>

            <p className="account-privacy">
              Your information should be handled securely.
            </p>

            <button
              type="submit"
              className="account-continue"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Continue"}
            </button>

            {message && (
              <p className="account-message" role="alert">
                {message}
              </p>
            )}
          </form>
        </main>
      </div>
    </>
  );
}
