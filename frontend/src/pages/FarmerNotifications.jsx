import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FarmerNotifications.css";

function FarmerNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="notifications-loading">Loading notifications...</div>
    );
  }

  return (
    <div className="farmer-notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <span>Farmer</span>
            <h1>Notifications</h1>
            <p>Stay updated with your latest MeatLink activities.</p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="notifications-error">{error}</div>}

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div>🔔</div>
            <h2>No Notifications</h2>
            <p>You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-card ${
                  notification.isRead ? "read" : "unread"
                }`}
              >
                <div className="notification-card-icon">🔔</div>

                <div className="notification-card-content">
                  <div className="notification-card-top">
                    <div>
                      <h3>{notification.title}</h3>

                      <span>{notification.type}</span>
                    </div>

                    {!notification.isRead && (
                      <span className="new-badge">New</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  {notification.sender && (
                    <small>
                      From: {notification.sender.firstName}{" "}
                      {notification.sender.lastName}
                    </small>
                  )}

                  {!notification.isRead && (
                    <button
                      className="read-btn"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerNotifications;
