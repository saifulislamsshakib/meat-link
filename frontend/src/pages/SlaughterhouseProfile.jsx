import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./SlaughterhouseProfile.css";

function SlaughterhouseProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
      });

      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/user/profile", formData);

      setMessage(response.data.message || "Profile updated successfully.");

      if (response.data.user) {
        setFormData({
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          phoneNo: response.data.user.phoneNo || "",
          address: response.data.user.address || "",
          city: response.data.user.city || "",
          zipCode: response.data.user.zipCode || "",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="slaughterhouse-profile-loading">Loading profile...</div>
    );
  }

  return (
    <div className="slaughterhouse-profile-page">
      <div className="profile-container">
        <div className="profile-top">
          <div>
            <p className="profile-label">Slaughterhouse</p>
            <h1>My Profile</h1>
            <p className="profile-description">
              Update your business contact and delivery information.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {formData.firstName?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div>
              <h2>
                {formData.firstName} {formData.lastName}
              </h2>

              <p>{user?.email || "Slaughterhouse Owner"}</p>
            </div>
          </div>

          {message && <div className="profile-success">✓ {message}</div>}

          {error && <div className="profile-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="phoneNo">Phone Number</label>

                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Business / Delivery Address</h3>

              <p className="section-help">
                This address will be used as the destination when a farmer
                assigns a driver to deliver livestock to your slaughterhouse.
              </p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Street Address</label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter slaughterhouse address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP / Postcode</label>

                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter ZIP / postcode"
                  />
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/slaughterhouse/dashboard")}
              >
                Cancel
              </button>

              <button type="submit" className="save-button" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SlaughterhouseProfile;
