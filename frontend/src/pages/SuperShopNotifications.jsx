import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SuperShopNotifications.css";

function SuperShopNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);

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

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);

      setError(
        error.response?.data?.message || "Failed to update notification.",
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loading) {
    return (
      <div className="ss-notifications-loading">Loading notifications...</div>
    );
  }

  return (
    <div className="ss-notifications-page">
      <div className="ss-notifications-container">
        {/* Header */}
        <div className="ss-notifications-header">
          <div>
            <span>Super Shop</span>

            <h1>Notifications</h1>

            <p>Stay updated with your order and MeatLink activities.</p>
          </div>

          <button
            type="button"
            className="ss-notifications-back"
            onClick={() => navigate("/super-shop/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {/* Summary */}
        <div className="ss-notification-summary">
          <div className="ss-notification-summary-card">
            <span>Total Notifications</span>
            <strong>{notifications.length}</strong>
          </div>

          <div className="ss-notification-summary-card">
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        {error && <div className="ss-notifications-error">{error}</div>}

        {/* Notifications */}
        {notifications.length === 0 ? (
          <div className="ss-notifications-empty">
            <div className="ss-notification-empty-icon">🔔</div>

            <h2>No Notifications</h2>

            <p>You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="ss-notification-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`ss-notification-card ${
                  notification.isRead ? "read" : "unread"
                }`}
              >
                <div className="ss-notification-icon">🔔</div>

                <div className="ss-notification-content">
                  <div className="ss-notification-top">
                    <div>
                      <h3>{notification.title}</h3>

                      <span>{notification.type}</span>
                    </div>

                    {!notification.isRead && (
                      <span className="ss-new-badge">New</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  {notification.sender && (
                    <small>
                      From: {notification.sender.firstName || ""}{" "}
                      {notification.sender.lastName || ""}
                    </small>
                  )}

                  <div className="ss-notification-footer">
                    <span>
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString(
                            "en-GB",
                          )
                        : ""}
                    </span>

                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification._id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperShopNotifications;
