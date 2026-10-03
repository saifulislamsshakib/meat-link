import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./DriverDashboard.css";

function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const loadDeliveries = async () => {
    try {
      setError("");

      const response = await api.get("/deliveries/my-deliveries");

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to load deliveries:", error);

      setError(error.response?.data?.message || "Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const updateDelivery = async (deliveryId, endpoint) => {
    try {
      setActionLoading(deliveryId);
      setError("");

      await api.patch(`/deliveries/${deliveryId}/${endpoint}`);

      await loadDeliveries();
    } catch (error) {
      console.error("Delivery update failed:", error);

      setError(error.response?.data?.message || "Failed to update delivery.");
    } finally {
      setActionLoading(null);
    }
  };

  const assignedCount = deliveries.filter(
    (item) => item.status === "assigned",
  ).length;

  const acceptedCount = deliveries.filter(
    (item) => item.status === "accepted",
  ).length;

  const inTransitCount = deliveries.filter(
    (item) => item.status === "in_transit",
  ).length;

  const deliveredCount = deliveries.filter(
    (item) => item.status === "delivered",
  ).length;

  const getAction = (delivery) => {
    switch (delivery.status) {
      case "assigned":
        return {
          label: "Accept Delivery",
          endpoint: "accept",
          className: "driver-accept-btn",
        };

      case "accepted":
        return {
          label: "Pick Up",
          endpoint: "pickup",
          className: "driver-pickup-btn",
        };

      case "picked_up":
        return {
          label: "Start Transit",
          endpoint: "start",
          className: "driver-transit-btn",
        };

      case "in_transit":
        return {
          label: "Mark as Delivered",
          endpoint: "complete",
          className: "driver-delivered-btn",
        };

      default:
        return null;
    }
  };

  const getDeliveryType = (delivery) => {
    if (delivery.deliveryType === "livestock_to_slaughterhouse") {
      return {
        label: "Livestock Delivery",
        icon: "🐄",
        className: "livestock",
      };
    }

    return {
      label: "Meat Delivery",
      icon: "🥩",
      className: "meat",
    };
  };

  if (loading) {
    return <div className="driver-loading">Loading driver dashboard...</div>;
  }

  return (
    <div className="driver-dashboard">
      {/* Sidebar */}
      <aside className="driver-sidebar">
        <div className="driver-brand">🚚 MeatLink</div>

        <nav className="driver-nav">
          <a className="active">Dashboard</a>

          <a onClick={() => navigate("/driver/deliveries")}>My Deliveries</a>

          <a onClick={() => navigate("/driver/notifications")}>Notifications</a>

          <a onClick={() => navigate("/complaints")}>Complaints</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="driver-main">
        {/* Header */}
        <div className="driver-header">
          <div>
            <p className="driver-label">Driver Dashboard</p>

            <h1>Welcome back, {user?.firstName || "Driver"} 👋</h1>

            <p>Manage your assigned deliveries and update delivery progress.</p>
          </div>

          <div className="driver-profile">
            <div className="driver-avatar">
              {user?.firstName?.charAt(0) || "D"}
            </div>

            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>

              <span>Driver</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="driver-error">{error}</div>}

        {/* Stats */}
        <section className="driver-stats">
          <div className="driver-stat-card">
            <span>Assigned</span>
            <strong>{assignedCount}</strong>
          </div>

          <div className="driver-stat-card">
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
          </div>

          <div className="driver-stat-card">
            <span>In Transit</span>
            <strong>{inTransitCount}</strong>
          </div>

          <div className="driver-stat-card">
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </div>
        </section>

        {/* Deliveries */}
        <section className="driver-section">
          <div className="driver-section-header">
            <div>
              <h2>My Deliveries</h2>
              <p>All deliveries currently assigned to you.</p>
            </div>
          </div>

          {deliveries.length === 0 ? (
            <div className="driver-empty">
              <div>🚚</div>

              <h2>No Deliveries</h2>

              <p>You don't have any assigned deliveries right now.</p>
            </div>
          ) : (
            <div className="driver-delivery-list">
              {deliveries.map((delivery) => {
                const action = getAction(delivery);

                const deliveryType = getDeliveryType(delivery);

                const isLivestock =
                  delivery.deliveryType === "livestock_to_slaughterhouse";

                const order = delivery.order;
                const product = order?.meatProduct;

                const procurement = delivery.procurementRequest;

                const livestock = procurement?.livestock;

                return (
                  <div className="driver-delivery-card" key={delivery._id}>
                    {/* Card Header */}
                    <div className="driver-card-header">
                      <div>
                        <div className="driver-type-badge-wrapper">
                          <span
                            className={`driver-type-badge ${deliveryType.className}`}
                          >
                            {deliveryType.icon} {deliveryType.label}
                          </span>
                        </div>

                        {isLivestock ? (
                          <>
                            <h2>
                              {livestock?.animalType
                                ? livestock.animalType.charAt(0).toUpperCase() +
                                  livestock.animalType.slice(1)
                                : "Livestock Delivery"}
                            </h2>

                            <p>
                              {livestock?.breed || "Livestock"} ·{" "}
                              {procurement?.requestedQuantity || 0} animal(s)
                            </p>
                          </>
                        ) : (
                          <>
                            <h2>{product?.productName || "Meat Order"}</h2>

                            <p>
                              {product?.meatType || "Meat"} ·{" "}
                              {order?.quantity || 0} kg
                            </p>
                          </>
                        )}
                      </div>

                      <span className={`driver-status ${delivery.status}`}>
                        {delivery.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Delivery Information */}
                    <div className="driver-info-grid">
                      <div>
                        <span>Pickup Location</span>

                        <strong>{delivery.pickupLocation || "N/A"}</strong>
                      </div>

                      <div>
                        <span>Delivery Address</span>

                        <strong>{delivery.deliveryAddress || "N/A"}</strong>
                      </div>

                      <div>
                        <span>City</span>

                        <strong>{delivery.deliveryCity || "N/A"}</strong>
                      </div>

                      <div>
                        <span>Zip Code</span>

                        <strong>{delivery.deliveryZipCode || "N/A"}</strong>
                      </div>

                      {isLivestock ? (
                        <>
                          <div>
                            <span>Farmer</span>

                            <strong>
                              {procurement?.farmer
                                ? `${procurement.farmer.firstName || ""} ${
                                    procurement.farmer.lastName || ""
                                  }`
                                : "N/A"}
                            </strong>
                          </div>

                          <div>
                            <span>Quantity</span>

                            <strong>
                              {procurement?.requestedQuantity || 0} animal(s)
                            </strong>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span>Order Total</span>

                            <strong className="driver-total">
                              ৳{" "}
                              {Number(order?.totalPrice || 0).toLocaleString()}
                            </strong>
                          </div>

                          <div>
                            <span>Quantity</span>

                            <strong>{order?.quantity || 0} kg</strong>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Notes */}
                    {delivery.notes && (
                      <div className="driver-notes">
                        <span>Notes</span>
                        <p>{delivery.notes}</p>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="driver-progress">
                      <div
                        className={
                          delivery.status !== "assigned"
                            ? "progress-item done"
                            : "progress-item current"
                        }
                      >
                        <span>Assigned</span>
                      </div>

                      <div
                        className={
                          [
                            "accepted",
                            "picked_up",
                            "in_transit",
                            "delivered",
                          ].includes(delivery.status)
                            ? "progress-line done"
                            : "progress-line"
                        }
                      />

                      <div
                        className={
                          [
                            "accepted",
                            "picked_up",
                            "in_transit",
                            "delivered",
                          ].includes(delivery.status)
                            ? "progress-item done"
                            : "progress-item"
                        }
                      >
                        <span>Accepted</span>
                      </div>

                      <div
                        className={
                          ["picked_up", "in_transit", "delivered"].includes(
                            delivery.status,
                          )
                            ? "progress-line done"
                            : "progress-line"
                        }
                      />

                      <div
                        className={
                          ["picked_up", "in_transit", "delivered"].includes(
                            delivery.status,
                          )
                            ? "progress-item done"
                            : "progress-item"
                        }
                      >
                        <span>Picked Up</span>
                      </div>

                      <div
                        className={
                          ["in_transit", "delivered"].includes(delivery.status)
                            ? "progress-line done"
                            : "progress-line"
                        }
                      />

                      <div
                        className={
                          ["in_transit", "delivered"].includes(delivery.status)
                            ? "progress-item done"
                            : "progress-item"
                        }
                      >
                        <span>In Transit</span>
                      </div>

                      <div
                        className={
                          delivery.status === "delivered"
                            ? "progress-line done"
                            : "progress-line"
                        }
                      />

                      <div
                        className={
                          delivery.status === "delivered"
                            ? "progress-item done"
                            : "progress-item"
                        }
                      >
                        <span>Delivered</span>
                      </div>
                    </div>

                    {/* Action */}
                    {action && (
                      <div className="driver-actions">
                        <button
                          type="button"
                          className={action.className}
                          disabled={actionLoading === delivery._id}
                          onClick={() =>
                            updateDelivery(delivery._id, action.endpoint)
                          }
                        >
                          {actionLoading === delivery._id
                            ? "Updating..."
                            : action.label}
                        </button>
                      </div>
                    )}

                    {/* Completed */}
                    {delivery.status === "delivered" && (
                      <div className="driver-complete">
                        ✓ Delivery completed successfully
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;
