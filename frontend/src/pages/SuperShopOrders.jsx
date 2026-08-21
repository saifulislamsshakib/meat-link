import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SuperShopOrders.css";

function SuperShopOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cleanDeliveryAddress = (address) => {
    if (!address) return "N/A";

    return address.replace(/^Delivery Address:\s*/i, "");
  };
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/meat-orders/my-orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(error.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusClass = (status) => {
    return `ss-order-status ${status || ""}`;
  };

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0,
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  if (loading) {
    return <div className="ss-orders-loading">Loading your orders...</div>;
  }

  return (
    <div className="ss-orders-page">
      <div className="ss-orders-container">
        {/* Header */}
        <div className="ss-orders-page-header">
          <div>
            <span>Super Shop</span>

            <h1>My Orders</h1>

            <p>Track your meat orders and delivery status.</p>
          </div>

          <button
            type="button"
            className="ss-orders-back"
            onClick={() => navigate("/super-shop/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="ss-orders-error">{error}</div>}

        {/* Summary */}
        <div className="ss-orders-summary">
          <div className="ss-order-summary-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="ss-order-summary-card">
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="ss-order-summary-card">
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>

          <div className="ss-order-summary-card">
            <span>Total Spent</span>
            <strong>৳ {totalSpent.toLocaleString()}</strong>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="ss-orders-empty">
            <div>🛒</div>

            <h2>No Orders Yet</h2>

            <p>Your meat orders will appear here.</p>

            <button
              type="button"
              className="ss-browse-btn"
              onClick={() => navigate("/super-shop/products")}
            >
              Browse Meat Products
            </button>
          </div>
        ) : (
          <div className="ss-order-list">
            {orders.map((order) => (
              <div className="ss-order-card" key={order._id}>
                <div className="ss-order-card-header">
                  <div>
                    <span className="ss-order-label">MEAT ORDER</span>

                    <h2>{order.meatProduct?.productName || "Meat Product"}</h2>

                    <p>Order ID: {order._id}</p>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div className="ss-order-details">
                  <div className="ss-order-detail">
                    <span>Meat Type</span>

                    <strong>{order.meatProduct?.meatType || "N/A"}</strong>
                  </div>

                  <div className="ss-order-detail">
                    <span>Quantity</span>

                    <strong>{order.quantity} kg</strong>
                  </div>

                  <div className="ss-order-detail">
                    <span>Price / Kg</span>

                    <strong>
                      ৳ {Number(order.pricePerKg || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div className="ss-order-detail">
                    <span>Total Price</span>

                    <strong className="ss-green">
                      ৳ {Number(order.totalPrice || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div className="ss-order-detail">
                    <span>Delivery City</span>

                    <strong>{order.deliveryCity || "N/A"}</strong>
                  </div>

                  <div className="ss-order-detail">
                    <span>Zip Code</span>

                    <strong>{order.deliveryZipCode || "N/A"}</strong>
                  </div>
                </div>

                <div className="ss-delivery-box">
                  <span>Delivery Address</span>

                  <strong>{cleanDeliveryAddress(order.deliveryAddress)}</strong>

                  {order.notes && (
                    <p>
                      <b>Notes:</b> {order.notes}
                    </p>
                  )}
                </div>

                <div className="ss-order-footer">
                  <div>
                    <span>Order Date</span>

                    <strong>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </strong>
                  </div>

                  <div className="ss-order-progress">
                    <span className="progress-step completed">
                      Order Placed
                    </span>

                    <span
                      className={`progress-line ${
                        [
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ].includes(order.status)
                          ? "active"
                          : ""
                      }`}
                    ></span>

                    <span
                      className={`progress-step ${
                        [
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      Confirmed
                    </span>

                    <span
                      className={`progress-line ${
                        ["processing", "shipped", "delivered"].includes(
                          order.status,
                        )
                          ? "active"
                          : ""
                      }`}
                    ></span>

                    <span
                      className={`progress-step ${
                        ["processing", "shipped", "delivered"].includes(
                          order.status,
                        )
                          ? "completed"
                          : ""
                      }`}
                    >
                      Processing
                    </span>

                    <span
                      className={`progress-line ${
                        ["shipped", "delivered"].includes(order.status)
                          ? "active"
                          : ""
                      }`}
                    ></span>

                    <span
                      className={`progress-step ${
                        ["shipped", "delivered"].includes(order.status)
                          ? "completed"
                          : ""
                      }`}
                    >
                      Shipped
                    </span>

                    <span
                      className={`progress-line ${
                        order.status === "delivered" ? "active" : ""
                      }`}
                    ></span>

                    <span
                      className={`progress-step ${
                        order.status === "delivered" ? "completed" : ""
                      }`}
                    >
                      Delivered
                    </span>
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

export default SuperShopOrders;
