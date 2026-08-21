import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./SlaughterhouseDashboard.css";

function SlaughterhouseDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/meat-orders/slaughterhouse-orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to load slaughterhouse dashboard:", error);

        setError(error.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const totalSales = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  if (loading) {
    return <div className="slaughterhouse-loading">Loading dashboard...</div>;
  }

  return (
    <div className="slaughterhouse-dashboard">
      <aside className="sh-sidebar">
        <div className="sh-brand">🥩 MeatLink</div>

        <nav className="sh-nav">
          <a className="active">Dashboard</a>

          <a onClick={() => navigate("/slaughterhouse/orders")}>Meat Orders</a>

          <a onClick={() => navigate("/slaughterhouse/procurement")}>
            Procurement
          </a>
          <a onClick={() => navigate("/slaughterhouse/procurement-requests")}>
            Procurement Requests
          </a>
          <a onClick={() => navigate("/slaughterhouse/product-management")}>
            Meat Products
          </a>

          <a onClick={() => navigate("/slaughterhouse/deliveries")}>
            Deliveries
          </a>

          {/* <a onClick={() => navigate("/slaughterhouse/invoices")}>Invoices</a>

          <a onClick={() => navigate("/slaughterhouse/reports")}>Reports</a> */}
          <a onClick={() => navigate("/complaints")}>Complaints</a>
        </nav>
      </aside>

      <main className="sh-main">
        <div className="sh-header">
          <div>
            <p className="sh-label">Slaughterhouse Dashboard</p>

            <h1>Welcome back, {user?.firstName || "Owner"} 👋</h1>

            <p>
              Manage orders, processing, procurement and delivery from one
              place.
            </p>
          </div>

          <div className="sh-profile">
            <div className="sh-avatar">{user?.firstName?.charAt(0) || "S"}</div>

            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>

              <span>Slaughterhouse Owner</span>
            </div>
          </div>
        </div>

        {error && <div className="sh-error">{error}</div>}

        <section className="sh-stats">
          <div className="sh-stat-card">
            <div className="sh-stat-icon">🛒</div>
            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon">⏳</div>
            <div>
              <span>Pending Orders</span>
              <strong>{pendingOrders}</strong>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon">⚙️</div>
            <div>
              <span>Processing</span>
              <strong>{processingOrders}</strong>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon">✅</div>
            <div>
              <span>Delivered</span>
              <strong>{deliveredOrders}</strong>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon">💰</div>
            <div>
              <span>Delivered Sales</span>
              <strong>৳ {totalSales.toLocaleString()}</strong>
            </div>
          </div>

          <div className="sh-stat-card">
            <div className="sh-stat-icon">📦</div>
            <div>
              <span>Confirmed</span>
              <strong>{confirmedOrders}</strong>
            </div>
          </div>
        </section>

        <section className="sh-section">
          <div className="sh-section-header">
            <div>
              <h2>Recent Meat Orders</h2>
              <p>Latest orders received from Super Shops</p>
            </div>

            <button
              className="sh-view-btn"
              onClick={() => navigate("/slaughterhouse/orders")}
            >
              View All
            </button>
          </div>

          <div className="sh-orders-card">
            <div className="sh-orders-header">
              <span>Product</span>
              <span>Super Shop</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Status</span>
            </div>

            {orders.length === 0 ? (
              <div className="sh-empty">No meat orders found.</div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div className="sh-order-row" key={order._id}>
                  <div>
                    <strong>
                      {order.meatProduct?.productName || "Meat Product"}
                    </strong>

                    <small>{order.meatProduct?.meatType || ""}</small>
                  </div>

                  <div>
                    {order.superShop?.firstName || "Super Shop"}{" "}
                    {order.superShop?.lastName || ""}
                  </div>

                  <div>{order.quantity} kg</div>

                  <div>৳ {Number(order.totalPrice || 0).toLocaleString()}</div>

                  <div>
                    <span className={`sh-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SlaughterhouseDashboard;
