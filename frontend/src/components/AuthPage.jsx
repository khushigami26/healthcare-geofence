import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
  User,
} from "lucide-react";

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname === "/register";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // =========================
    // VALIDATION
    // =========================

    if (isRegister && !name) {
      setError("Please enter your full name.");
      return;
    }

    if (isRegister && name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // =========================
    // REGISTER
    // =========================

    if (isRegister) {
      const existingUser = localStorage.getItem("healthcareUser");

      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);

        if (parsedUser.email === email) {
          setError("An account with this email already exists.");
          return;
        }
      }

      const user = {
        name,
        email,
        password,
      };

      localStorage.setItem("healthcareUser", JSON.stringify(user));

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        setFormData({
          name: "",
          email: email,
          password: "",
        });

        setSuccess("");
        navigate("/login");
      }, 1000);

      return;
    }

    // =========================
    // LOGIN
    // =========================

    const savedUser = localStorage.getItem("healthcareUser");

    if (!savedUser) {
      setError("No account found. Please create an account first.");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.email !== email || user.password !== password) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("healthcareLoggedIn", "true");

    onLogin(user);

    navigate("/dashboard");
  };

  const handleAuthSwitch = () => {
    setError("");
    setSuccess("");
    setFormData({
      name: "",
      email: "",
      password: "",
    });

    if (isRegister) {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="auth-page">
      {/* BACKGROUND DECORATION */}

      <div className="auth-background-circle circle-one"></div>

      <div className="auth-background-circle circle-two"></div>

      <div className="auth-container">
        {/* =====================================
            LEFT BRAND PANEL
        ====================================== */}

        <div className="auth-brand-panel">
          {/* LOGO */}

          <div className="brand-logo">
            <div className="brand-icon">
              <HeartPulse size={28} />
            </div>

            <div>
              <h2>CareSphere</h2>

              <span>Healthcare Management</span>
            </div>
          </div>

          {/* BRAND CONTENT */}

          <div className="brand-content">
            <span className="brand-badge">
              <ShieldCheck size={15} />
              Secure Healthcare Platform
            </span>

            <h1>
              Smarter healthcare.
              <br />
              <span>Better patient care.</span>
            </h1>

            <p>
              Manage patients, family members, locations and geo-fence
              monitoring from one simple healthcare management platform.
            </p>

            {/* FEATURES */}

            <div className="feature-list">
              <div>
                <CheckCircle2 />

                <span>Patient Management</span>
              </div>

              <div>
                <CheckCircle2 />

                <span>Real-time Geo-Fence Monitoring</span>
              </div>

              <div>
                <CheckCircle2 />

                <span>Family & Emergency Alerts</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="auth-brand-footer">
            <span>© 2026 CareSphere</span>

            <span>Healthcare Management System</span>
          </div>
        </div>

        {/* =====================================
            RIGHT FORM PANEL
        ====================================== */}

        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            {/* MOBILE LOGO */}

            <div className="auth-mobile-logo">
              <div className="brand-icon">
                <HeartPulse size={24} />
              </div>

              <div>
                <h2>CareSphere</h2>

                <span>Healthcare Management</span>
              </div>
            </div>

            {/* HEADING */}

            <div className="auth-heading">
              <span className="auth-small-title">
                {isRegister ? "GET STARTED" : "WELCOME BACK"}
              </span>

              <h2>
                {isRegister ? "Create your account" : "Sign in to your account"}
              </h2>

              <p>
                {isRegister
                  ? "Create an account to manage your healthcare workspace."
                  : "Enter your credentials to continue to your dashboard."}
              </p>
            </div>

            {/* ERROR */}

            {error && <div className="auth-error">{error}</div>}

            {/* SUCCESS */}

            {success && <div className="auth-success">{success}</div>}

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              {/* NAME */}

              {isRegister && (
                <div className="input-group">
                  <label>Full Name</label>

                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-input-icon" />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}

              <div className="input-group">
                <label>Email Address</label>

                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="input-group">
                <label>Password</label>

                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* LOGIN OPTIONS */}

              {!isRegister && (
                <div className="auth-options">
                  <label className="remember-option">
                    <input type="checkbox" />

                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-button"
                    onClick={() =>
                      setError("Password recovery will be available soon.")
                    }
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* SUBMIT */}

              <button type="submit" className="auth-submit">
                <span>{isRegister ? "Create Account" : "Sign In"}</span>

                <ArrowRight size={18} />
              </button>
            </form>

            {/* SWITCH LOGIN / REGISTER */}

            <div className="auth-switch">
              <span>
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button type="button" onClick={handleAuthSwitch}>
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </div>

            {/* SECURITY */}

            <div className="security-note">
              <ShieldCheck size={16} />

              <span>Your healthcare workspace is protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
