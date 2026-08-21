import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./SuperShopDashboard.css";

function SuperShopDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productResponse, orderResponse] = await Promise.all([
          api.get("/meat-products/available"),
          api.get("/meat-orders/my-orders"),
        ]);

        setProducts(productResponse.data.products || []);

        setOrders(orderResponse.data.orders || []);
      } catch (error) {
        console.error("Failed to load super shop dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0,
  );

  if (loading) {
    return <div className="ss-loading">Loading dashboard...</div>;
  }

  return (
    <div className="super-shop-dashboard">
      {/* Sidebar */}
      <aside className="ss-sidebar">
        <div className="ss-brand">🥩 MeatLink</div>

        <nav className="ss-nav">
          <a className="active">Dashboard</a>

          <a onClick={() => navigate("/super-shop/products")}>Meat Products</a>

          <a onClick={() => navigate("/super-shop/orders")}>My Orders</a>

          <a onClick={() => navigate("/super-shop/notifications")}>
            Notifications
          </a>

          <a onClick={() => navigate("/super-shop/invoices")}>Invoices</a>
          <a onClick={() => navigate("/complaints")}>Complaints</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="ss-main">
        {/* Header */}
        <div className="ss-header">
          <div>
            <p className="ss-label">Super Shop Dashboard</p>

            <h1>Welcome back, {user?.firstName || "Super Shop"} 👋</h1>

            <p>Browse available meat products and manage your orders.</p>
          </div>

          <div className="ss-profile">
            <div className="ss-avatar">{user?.firstName?.charAt(0) || "S"}</div>

            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>

              <span>Super Shop</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="ss-stats">
          <div className="ss-stat-card">
            <span>Available Products</span>
            <strong>{products.length}</strong>
          </div>

          <div className="ss-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="ss-stat-card">
            <span>Pending Orders</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="ss-stat-card">
            <span>Delivered Orders</span>
            <strong>{deliveredOrders}</strong>
          </div>

          <div className="ss-stat-card">
            <span>Total Spent</span>
            <strong>৳ {totalSpent.toLocaleString()}</strong>
          </div>
        </section>

        {/* Available Meat Products */}
        <section className="ss-section">
          <div className="ss-section-header">
            <div>
              <h2>Available Meat Products</h2>

              <p>Fresh packaged products ready for order.</p>
            </div>

            <button
              className="ss-view-btn"
              onClick={() => navigate("/super-shop/products")}
            >
              View All
            </button>
          </div>

          <div className="ss-products">
            {products.length === 0 ? (
              <div className="ss-empty">
                No packaged meat products available.
              </div>
            ) : (
              products.slice(0, 4).map((product) => (
                <button
                  type="button"
                  className="ss-product-card ss-product-clickable"
                  key={product._id}
                  onClick={() => navigate("/super-shop/products")}
                >
                  <div className="ss-product-icon">🥩</div>

                  <div className="ss-product-info">
                    <h3>{product.productName}</h3>

                    <span>{product.meatType}</span>

                    <p>{product.quantity} kg available</p>
                  </div>

                  <strong className="ss-product-price">
                    ৳ {Number(product.pricePerKg || 0).toLocaleString()}
                    <small>/kg</small>
                  </strong>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="ss-section">
          <div className="ss-section-header">
            <div>
              <h2>Recent Orders</h2>

              <p>Your latest meat orders.</p>
            </div>

            <button
              className="ss-view-btn"
              onClick={() => navigate("/super-shop/orders")}
            >
              View All
            </button>
          </div>

          <div className="ss-orders-card">
            <div className="ss-orders-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Status</span>
            </div>

            {orders.length === 0 ? (
              <div className="ss-empty">No orders found.</div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div className="ss-order-row" key={order._id}>
                  <strong>
                    {order.meatProduct?.productName || "Meat Product"}
                  </strong>

                  <span>{order.quantity} kg</span>

                  <span>
                    ৳ {Number(order.totalPrice || 0).toLocaleString()}
                  </span>

                  <span className={`ss-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SuperShopDashboard;
