import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./FarmerDashboard.css";

function FarmerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [livestock, setLivestock] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [livestockResponse, notificationResponse] = await Promise.all([
          api.get("/livestock"),
          api.get("/notifications"),
        ]);

        setLivestock(livestockResponse.data.livestock || []);

        setNotifications(notificationResponse.data.notifications || []);
      } catch (error) {
        console.error("Dashboard data loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalAnimals = livestock.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const availableAnimals = livestock.reduce(
    (sum, item) => sum + Number(item.availableQuantity || 0),
    0,
  );

  const unreadNotifications = notifications.filter(
    (item) => !item.isRead,
  ).length;

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="farmer-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">🥩 MeatLink</div>

        <nav className="dashboard-nav">
          <a className="active">Dashboard</a>

          <a onClick={() => navigate("/farmer/livestock")}>Livestock</a>

          <a onClick={() => navigate("/farmer/requests")}>Requests</a>

          <a onClick={() => navigate("/farmer/notifications")}>Notifications</a>

          <a onClick={() => navigate("/farmer/transactions")}>Transactions</a>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Section */}
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-label">Farmer Dashboard</p>

            <h1>Welcome back, {user?.firstName || "Farmer"} 👋</h1>

            <p className="dashboard-subtitle">
              Manage your livestock and procurement requests from one place.
            </p>
          </div>

          <div className="profile-box">
            <div className="profile-avatar">
              {user?.firstName?.charAt(0) || "F"}
            </div>

            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>

              <span>Farmer</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🐄</span>

            <div>
              <p>Total Animals</p>
              <h2>{totalAnimals}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📦</span>

            <div>
              <p>Available Animals</p>
              <h2>{availableAnimals}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔔</span>

            <div>
              <p>Unread Notifications</p>
              <h2>{unreadNotifications}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <p>Livestock Records</p>
              <h2>{livestock.length}</h2>
            </div>
          </div>
        </section>

        {/* Livestock Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>My Livestock</h2>

              <p>Your currently registered livestock</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => navigate("/farmer/livestock/add")}
            >
              + Add Livestock
            </button>
          </div>

          <div className="livestock-table">
            <div className="table-header">
              <span>Animal</span>
              <span>Breed</span>
              <span>Quantity</span>
              <span>Available</span>
              <span>Status</span>
            </div>

            {livestock.length === 0 ? (
              <div className="empty-state">No livestock found.</div>
            ) : (
              livestock.map((item) => (
                <div className="table-row" key={item._id}>
                  <span>
                    <strong>{item.animalType}</strong>
                  </span>

                  <span>{item.breed}</span>

                  <span>{item.quantity}</span>

                  <span>{item.availableQuantity}</span>

                  <span>
                    <span className={`status-badge ${item.availabilityStatus}`}>
                      {item.availabilityStatus}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notifications */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Notifications</h2>

              <p>Latest updates from MeatLink</p>
            </div>

            <button
              className="secondary-btn"
              onClick={() => navigate("/farmer/notifications")}
            >
              View All
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">No notifications yet.</div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  key={notification._id}
                >
                  <div className="notification-icon">🔔</div>

                  <div>
                    <strong>{notification.title}</strong>

                    <p>{notification.message}</p>
                  </div>

                  {!notification.isRead && (
                    <span className="notification-dot"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default FarmerDashboard;
