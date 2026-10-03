import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", formData);

      const { accessToken, user } = response.data;

      login(accessToken, user);

      switch (user.role) {
        case "farmer":
          navigate("/farmer/dashboard");
          break;

        case "slaughterhouse":
          navigate("/slaughterhouse/dashboard");
          break;

        case "super_shop":
          navigate("/super-shop/dashboard");
          break;

        case "driver":
          navigate("/driver/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">
        <div className="login-left">
          <div className="hero-badge">Smart Meat Supply Chain</div>

          <h1>
            From Farm
            <br />
            <span>to Fresh.</span>
          </h1>

          <p>
            MeatLink connects farmers, slaughterhouses, super shops and delivery
            partners in one smart supply chain platform.
          </p>

          <div className="login-features">
            <div className="mini-feature">
              <span>✓</span>
              <div>
                <strong>Smart Procurement</strong>
                <small>Manage livestock digitally</small>
              </div>
            </div>

            <div className="mini-feature">
              <span>✓</span>
              <div>
                <strong>Live Order Tracking</strong>
                <small>Track orders from start to finish</small>
              </div>
            </div>

            <div className="mini-feature">
              <span>✓</span>
              <div>
                <strong>Easy Delivery</strong>
                <small>Connect drivers and shops</small>
              </div>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">🥩</div>

            <h2>Welcome Back</h2>

            <p>Sign in to continue to your MeatLink account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <a href="#">Forgot password?</a>
              </div>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <span>New to MeatLink?</span>

            <Link to="/register" className="login-signup-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
