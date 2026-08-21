import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./UserComplaints.css";

function UserComplaints() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    relatedOrder: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getDashboardPath = () => {
    switch (user?.role) {
      case "farmer":
        return "/farmer/dashboard";

      case "slaughterhouse":
        return "/slaughterhouse/dashboard";

      case "super_shop":
        return "/super-shop/dashboard";

      case "driver":
        return "/driver/dashboard";

      default:
        return "/";
    }
  };

  useEffect(() => {
    setFormData({
      subject: "",
      message: "",
      relatedOrder: "",
    });

    setSuccess("");
    setError("");
  }, []);

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

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError("Subject and message are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/complaints", {
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        relatedOrder: formData.relatedOrder.trim() || undefined,
      });

      setSuccess(response.data.message || "Complaint submitted successfully.");

      setFormData({
        subject: "",
        message: "",
        relatedOrder: "",
      });
    } catch (error) {
      console.error("Failed to submit complaint:", error);

      setError(error.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-complaints-page">
      <div className="user-complaints-container">
        <div className="user-complaints-header">
          <div>
            <span>MeatLink Support</span>

            <h1>Submit a Complaint</h1>

            <p>Report an issue and our administration team will review it.</p>
          </div>

          <button
            type="button"
            className="user-complaints-back"
            onClick={() => navigate(getDashboardPath())}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="user-complaints-error">{error}</div>}

        {success && (
          <div className="user-complaints-success">
            <strong>Complaint Submitted</strong>

            <p>{success}</p>

            <small>
              Your complaint has been sent to the administrator for review.
            </small>
          </div>
        )}

        <div className="user-complaint-card">
          <div className="user-complaint-card-header">
            <div>
              <span>NEW COMPLAINT</span>

              <h2>Tell us what went wrong</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="user-complaint-form">
            <div className="user-complaint-field">
              <label htmlFor="subject">Subject *</label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Delivery Delay"
                maxLength={120}
                required
              />
            </div>

            <div className="user-complaint-field">
              <label htmlFor="relatedOrder">Related Order ID</label>

              <input
                id="relatedOrder"
                name="relatedOrder"
                type="text"
                value={formData.relatedOrder}
                onChange={handleChange}
                placeholder="Optional — paste the order ID"
              />

              <small>
                Leave this empty if the complaint is not related to an order.
              </small>
            </div>

            <div className="user-complaint-field">
              <label htmlFor="message">Message *</label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue clearly..."
                rows="7"
                maxLength={2000}
                required
              />
            </div>

            <div className="user-complaint-actions">
              <button
                type="button"
                className="user-complaint-cancel"
                onClick={() => navigate(getDashboardPath())}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="user-complaint-submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>

        <div className="user-complaint-info">
          <span>How it works</span>

          <div className="user-complaint-steps">
            <div>
              <strong>1</strong>
              <p>Submit your complaint with the issue details.</p>
            </div>

            <div>
              <strong>2</strong>
              <p>Admin reviews and processes the complaint.</p>
            </div>

            <div>
              <strong>3</strong>
              <p>Admin resolves or rejects the complaint.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserComplaints;
