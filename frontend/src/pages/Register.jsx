import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { firstName, lastName, email, password, confirmPassword, role } =
      formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      setSuccess(
        response.data.message ||
          "Registration successful. Please check your email to verify your account.",
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <div className="register-brand-icon">🥩</div>

          <div>
            <h1>MeatLink</h1>
            <span>Create your account</span>
          </div>
        </div>

        <div className="register-header">
          <h2>Sign Up</h2>

          <p>Join MeatLink and connect with the smart meat supply chain.</p>
        </div>

        {error && <div className="register-error">{error}</div>}

        {success && (
          <div className="register-success">
            {success}

            <div className="register-success-note">
              After email verification, your account will be reviewed by an
              administrator.
            </div>
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-row">
            <div className="register-field">
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>

            <div className="register-field">
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="register-field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="register-field">
            <label>Account Type</label>

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select account type</option>

              <option value="farmer">Farmer</option>

              <option value="slaughterhouse">Slaughterhouse</option>

              <option value="super_shop">Super Shop</option>

              <option value="driver">Driver</option>
            </select>

            <small>
              Admin accounts cannot be created through public registration.
            </small>
          </div>

          <div className="register-row">
            <div className="register-field">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
              />
            </div>

            <div className="register-field">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button type="submit" className="register-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account?</span>

          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
