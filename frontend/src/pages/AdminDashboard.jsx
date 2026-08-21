import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setError("");

        const response = await api.get("/admin/dashboard");

        setAnalytics(response.data.analytics || null);
      } catch (error) {
        console.error("Failed to load admin analytics:", error);

        setError(
          error.response?.data?.message || "Failed to load admin dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  if (!analytics) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-error">
            {error || "No analytics data available."}
          </div>
        </div>
      </div>
    );
  }

  const { users, orders, deliveries, livestock, complaints, revenue } =
    analytics;

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <span className="admin-label">Administration</span>

            <h1>Welcome back, {user?.firstName || "Admin"} 👋</h1>

            <p>
              Monitor MeatLink users, orders, deliveries, complaints and
              revenue.
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>

              <span>Administrator</span>
            </div>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {/* Main Stats */}
        <section className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>

            <div>
              <span>Total Users</span>
              <strong>{users.total}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🛒</div>

            <div>
              <span>Total Orders</span>
              <strong>{orders.total}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🚚</div>

            <div>
              <span>Total Deliveries</span>
              <strong>{deliveries.total}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">💰</div>

            <div>
              <span>Revenue</span>
              <strong>৳ {Number(revenue.total || 0).toLocaleString()}</strong>
            </div>
          </div>
        </section>

        {/* User Overview */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>User Overview</h2>

              <p>Registered users by role.</p>
            </div>

            <button
              type="button"
              className="admin-view-btn"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </button>
          </div>

          <div className="admin-overview-grid">
            <div className="admin-overview-card">
              <span>Farmers</span>
              <strong>{users.farmers}</strong>
            </div>

            <div className="admin-overview-card">
              <span>Slaughterhouses</span>
              <strong>{users.slaughterhouses}</strong>
            </div>

            <div className="admin-overview-card">
              <span>Super Shops</span>
              <strong>{users.superShops}</strong>
            </div>

            <div className="admin-overview-card">
              <span>Drivers</span>
              <strong>{users.drivers}</strong>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>Order Overview</h2>

              <p>Current order statuses.</p>
            </div>

            <button
              type="button"
              className="admin-view-btn"
              onClick={() => navigate("/admin/orders")}
            >
              View Orders
            </button>
          </div>

          <div className="admin-status-grid">
            <div className="admin-status-card">
              <span>Pending</span>
              <strong>{orders.pending}</strong>
            </div>

            <div className="admin-status-card">
              <span>Confirmed</span>
              <strong>{orders.confirmed}</strong>
            </div>

            <div className="admin-status-card">
              <span>Processing</span>
              <strong>{orders.processing}</strong>
            </div>

            <div className="admin-status-card">
              <span>Shipped</span>
              <strong>{orders.shipped}</strong>
            </div>

            <div className="admin-status-card success">
              <span>Delivered</span>
              <strong>{orders.delivered}</strong>
            </div>
          </div>
        </section>

        {/* Other Overview */}
        <section className="admin-bottom-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Livestock</h2>
                <p>Current livestock availability.</p>
              </div>
            </div>

            <div className="admin-panel-stats">
              <div>
                <span>Total</span>
                <strong>{livestock.total}</strong>
              </div>

              <div>
                <span>Available</span>
                <strong className="green">{livestock.available}</strong>
              </div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Complaints</h2>
                <p>Current complaint status.</p>
              </div>
            </div>

            <div className="admin-panel-stats">
              <div>
                <span>Total</span>
                <strong>{complaints.total}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong className="warning">{complaints.pending}</strong>
              </div>

              <div>
                <span>Resolved</span>
                <strong className="green">{complaints.resolved}</strong>
              </div>
            </div>

            <button
              type="button"
              className="admin-panel-btn"
              onClick={() => navigate("/admin/complaints")}
            >
              Manage Complaints
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>Quick Actions</h2>

              <p>Manage the most important admin tasks.</p>
            </div>
          </div>

          <div className="admin-actions">
            <button type="button" onClick={() => navigate("/admin/users")}>
              👥 Manage Users
            </button>

            <button type="button" onClick={() => navigate("/admin/orders")}>
              🛒 View Orders
            </button>

            <button type="button" onClick={() => navigate("/admin/deliveries")}>
              🚚 View Deliveries
            </button>

            <button type="button" onClick={() => navigate("/admin/reports")}>
              📊 View Reports
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
