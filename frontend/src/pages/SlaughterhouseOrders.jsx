import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseOrders.css";

function SlaughterhouseOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const response = await api.get("/meat-orders/slaughterhouse-orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to load slaughterhouse orders:", error);

      setError(error.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setActionLoading(orderId);
      setError("");

      await api.patch(`/meat-orders/${orderId}/status`, {
        status,
      });

      await loadOrders();
    } catch (error) {
      console.error("Order status update failed:", error);

      setError(
        error.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getNextAction = (order) => {
    if (order.status === "pending") {
      return {
        label: "Confirm Order",
        nextStatus: "confirmed",
        className: "confirm-btn",
      };
    }

    if (order.status === "confirmed") {
      return {
        label: "Start Processing",
        nextStatus: "processing",
        className: "process-btn",
      };
    }

    if (order.status === "processing") {
      return {
        label: "Mark as Shipped",
        nextStatus: "shipped",
        className: "ship-btn",
      };
    }

    return null;
  };

  if (loading) {
    return <div className="sh-orders-loading">Loading meat orders...</div>;
  }

  return (
    <div className="sh-orders-page">
      <div className="sh-orders-container">
        <div className="sh-orders-page-header">
          <div>
            <span className="sh-orders-label">Slaughterhouse</span>

            <h1>Meat Orders</h1>

            <p>Review and manage meat orders from Super Shops.</p>
          </div>

          <button
            className="sh-back-btn"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="sh-orders-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="sh-empty-orders">
            <div className="empty-orders-icon">🛒</div>

            <h2>No Meat Orders</h2>

            <p>There are no meat orders to display.</p>
          </div>
        ) : (
          <div className="sh-order-list">
            {orders.map((order) => {
              const nextAction = getNextAction(order);

              return (
                <div className="sh-order-card" key={order._id}>
                  <div className="sh-order-card-header">
                    <div>
                      <span className="order-label">MEAT ORDER</span>

                      <h2>
                        {order.meatProduct?.productName || "Meat Product"}
                      </h2>

                      <p className="order-id">Order ID: {order._id}</p>
                    </div>

                    <span className={`sh-order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="sh-order-grid">
                    <div className="sh-order-info">
                      <span>Super Shop</span>

                      <strong>
                        {order.superShop?.firstName || "Super Shop"}{" "}
                        {order.superShop?.lastName || ""}
                      </strong>

                      <small>{order.superShop?.email || ""}</small>
                    </div>

                    <div className="sh-order-info">
                      <span>Meat Type</span>

                      <strong>{order.meatProduct?.meatType || "N/A"}</strong>
                    </div>

                    <div className="sh-order-info">
                      <span>Quantity</span>

                      <strong>{order.quantity} kg</strong>
                    </div>

                    <div className="sh-order-info">
                      <span>Price / Kg</span>

                      <strong>
                        ৳ {Number(order.pricePerKg || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="sh-order-info">
                      <span>Total Price</span>

                      <strong className="total-price">
                        ৳ {Number(order.totalPrice || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="sh-order-info">
                      <span>Delivery City</span>

                      <strong>{order.deliveryCity || "N/A"}</strong>
                    </div>
                  </div>

                  <div className="sh-delivery-info">
                    <span>Delivery Address</span>

                    <strong>{order.deliveryAddress || "N/A"}</strong>

                    {order.notes && (
                      <p>
                        <b>Notes:</b> {order.notes}
                      </p>
                    )}
                  </div>

                  {nextAction && (
                    <div className="sh-order-actions">
                      <button
                        className={nextAction.className}
                        disabled={actionLoading === order._id}
                        onClick={() =>
                          updateOrderStatus(order._id, nextAction.nextStatus)
                        }
                      >
                        {actionLoading === order._id
                          ? "Updating..."
                          : nextAction.label}
                      </button>
                    </div>
                  )}

                  {order.status === "shipped" && (
                    <div className="sh-complete-message">
                      ✓ Order has been shipped. Ready for delivery.
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="sh-delivered-message">
                      ✓ Order successfully delivered.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlaughterhouseOrders;
