import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const response = await api.get("/admin/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to load admin orders:", error);

      setError(error.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusClass = (status) => {
    return `admin-order-status ${status || ""}`;
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const productName = order.meatProduct?.productName || "";

      const shopName = `${order.superShop?.firstName || ""} ${
        order.superShop?.lastName || ""
      }`;

      const orderId = order._id || "";

      const matchesSearch =
        !query ||
        productName.toLowerCase().includes(query) ||
        shopName.toLowerCase().includes(query) ||
        orderId.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    processing: orders.filter((order) => order.status === "processing").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
  };

  if (loading) {
    return <div className="admin-orders-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        {/* Header */}
        <div className="admin-orders-header">
          <div>
            <span>Administration</span>

            <h1>Order Management</h1>

            <p>Monitor all meat orders across the MeatLink platform.</p>
          </div>

          <button
            type="button"
            className="admin-orders-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-orders-error">{error}</div>}

        {/* Status Summary */}
        <div className="admin-orders-summary">
          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "all" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <span>Total</span>
            <strong>{statusCounts.all}</strong>
          </button>

          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <span>Pending</span>
            <strong>{statusCounts.pending}</strong>
          </button>

          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "confirmed" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("confirmed")}
          >
            <span>Confirmed</span>
            <strong>{statusCounts.confirmed}</strong>
          </button>

          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "processing" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("processing")}
          >
            <span>Processing</span>
            <strong>{statusCounts.processing}</strong>
          </button>

          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "shipped" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("shipped")}
          >
            <span>Shipped</span>
            <strong>{statusCounts.shipped}</strong>
          </button>

          <button
            type="button"
            className={`admin-order-summary-card ${
              statusFilter === "delivered" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("delivered")}
          >
            <span>Delivered</span>
            <strong>{statusCounts.delivered}</strong>
          </button>
        </div>

        {/* Search */}
        <div className="admin-orders-filters">
          <input
            type="text"
            placeholder="Search by product, Super Shop or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="confirmed">Confirmed</option>

            <option value="processing">Processing</option>

            <option value="shipped">Shipped</option>

            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            <div>🛒</div>

            <h2>No Orders Found</h2>

            <p>No orders match your current search or status filter.</p>
          </div>
        ) : (
          <div className="admin-orders-card">
            <div className="admin-orders-table-header">
              <span>ORDER</span>
              <span>SUPER SHOP</span>
              <span>PRODUCT</span>
              <span>QUANTITY</span>
              <span>TOTAL</span>
              <span>STATUS</span>
              <span>DATE</span>
            </div>

            <div className="admin-orders-table">
              {filteredOrders.map((order) => (
                <div className="admin-order-row" key={order._id}>
                  {/* Order */}
                  <div className="admin-order-cell">
                    <strong className="order-id">{order._id}</strong>
                  </div>

                  {/* Super Shop */}
                  <div className="admin-order-cell">
                    <strong>
                      {order.superShop
                        ? `${order.superShop.firstName || ""} ${
                            order.superShop.lastName || ""
                          }`
                        : "N/A"}
                    </strong>

                    <small>{order.superShop?.email || ""}</small>
                  </div>

                  {/* Product */}
                  <div className="admin-order-cell">
                    <strong>
                      {order.meatProduct?.productName || "Meat Product"}
                    </strong>

                    <small>{order.meatProduct?.meatType || "N/A"}</small>
                  </div>

                  {/* Quantity */}
                  <div className="admin-order-cell">
                    <span>{order.quantity} kg</span>
                  </div>

                  {/* Total */}
                  <div className="admin-order-cell">
                    <strong className="admin-order-total">
                      ৳ {Number(order.totalPrice || 0).toLocaleString()}
                    </strong>

                    <small>
                      ৳ {Number(order.pricePerKg || 0).toLocaleString()}/ kg
                    </small>
                  </div>

                  {/* Status */}
                  <div className="admin-order-cell">
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="admin-order-cell">
                    <span>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
