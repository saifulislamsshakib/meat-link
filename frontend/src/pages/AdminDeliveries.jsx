import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDeliveries.css";

function AdminDeliveries() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadDeliveries = async () => {
    try {
      setError("");

      const response = await api.get("/admin/deliveries");

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to load admin deliveries:", error);

      setError(error.response?.data?.message || "Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const normalizeStatus = (status) => {
    return (status || "").toLowerCase();
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClass = (status) => {
    return `admin-delivery-status ${normalizeStatus(status)}`;
  };

  const filteredDeliveries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const status = normalizeStatus(delivery.status);

      const driverName = `${delivery.driver?.firstName || ""} ${
        delivery.driver?.lastName || ""
      }`.toLowerCase();

      const driverEmail = (delivery.driver?.email || "").toLowerCase();

      const productName = (
        delivery.order?.meatProduct?.productName || ""
      ).toLowerCase();

      const superShopName = `${delivery.order?.superShop?.firstName || ""} ${
        delivery.order?.superShop?.lastName || ""
      }`.toLowerCase();

      const orderId = (delivery.order?._id || "").toLowerCase();

      const deliveryId = (delivery._id || "").toLowerCase();

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesSearch =
        !query ||
        driverName.includes(query) ||
        driverEmail.includes(query) ||
        productName.includes(query) ||
        superShopName.includes(query) ||
        orderId.includes(query) ||
        deliveryId.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [deliveries, statusFilter, search]);

  const statusCounts = {
    all: deliveries.length,
    assigned: deliveries.filter((item) => item.status === "assigned").length,
    accepted: deliveries.filter((item) => item.status === "accepted").length,
    picked_up: deliveries.filter((item) => item.status === "picked_up").length,
    in_transit: deliveries.filter((item) => item.status === "in_transit")
      .length,
    delivered: deliveries.filter((item) => item.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="admin-deliveries-loading">Loading deliveries...</div>
    );
  }

  return (
    <div className="admin-deliveries-page">
      <div className="admin-deliveries-container">
        {/* Header */}
        <div className="admin-deliveries-header">
          <div>
            <span>Administration</span>

            <h1>Delivery Management</h1>

            <p>
              Monitor driver assignments and delivery progress across MeatLink.
            </p>
          </div>

          <button
            type="button"
            className="admin-deliveries-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-deliveries-error">{error}</div>}

        {/* Status Summary */}
        <div className="admin-deliveries-summary">
          {[
            ["all", "Total"],
            ["assigned", "Assigned"],
            ["accepted", "Accepted"],
            ["picked_up", "Picked Up"],
            ["in_transit", "In Transit"],
            ["delivered", "Delivered"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`admin-delivery-summary-card ${
                statusFilter === key ? "active" : ""
              }`}
              onClick={() => setStatusFilter(key)}
            >
              <span>{label}</span>

              <strong>{statusCounts[key]}</strong>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="admin-deliveries-filters">
          <input
            type="text"
            placeholder="Search by driver, order, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="assigned">Assigned</option>

            <option value="accepted">Accepted</option>

            <option value="picked_up">Picked Up</option>

            <option value="in_transit">In Transit</option>

            <option value="delivered">Delivered</option>
          </select>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="admin-deliveries-empty">
            <div>🚚</div>

            <h2>No Deliveries Found</h2>

            <p>No deliveries match your current search or status filter.</p>
          </div>
        ) : (
          <div className="admin-deliveries-list">
            {filteredDeliveries.map((delivery) => {
              const order = delivery.order;
              const product = order?.meatProduct;
              const driver = delivery.driver;
              const shop = order?.superShop;

              return (
                <div className="admin-delivery-card" key={delivery._id}>
                  <div className="admin-delivery-card-header">
                    <div>
                      <span className="admin-delivery-label">DELIVERY</span>

                      <h2>{product?.productName || "Meat Order"}</h2>

                      <p>Delivery ID: {delivery._id}</p>
                    </div>

                    <span className={getStatusClass(delivery.status)}>
                      {formatStatus(delivery.status)}
                    </span>
                  </div>

                  <div className="admin-delivery-grid">
                    <div>
                      <span>Driver</span>

                      <strong>
                        {driver
                          ? `${driver.firstName || ""} ${driver.lastName || ""}`
                          : "Not assigned"}
                      </strong>

                      <small>{driver?.email || ""}</small>
                    </div>

                    <div>
                      <span>Super Shop</span>

                      <strong>
                        {shop
                          ? `${shop.firstName || ""} ${shop.lastName || ""}`
                          : "N/A"}
                      </strong>

                      <small>{shop?.email || ""}</small>
                    </div>

                    <div>
                      <span>Quantity</span>

                      <strong>{order?.quantity || 0} kg</strong>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong className="admin-delivery-total">
                        ৳ {Number(order?.totalPrice || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>Pickup</span>

                      <strong>{delivery.pickupLocation || "N/A"}</strong>
                    </div>

                    <div>
                      <span>Delivery Address</span>

                      <strong>{delivery.deliveryAddress || "N/A"}</strong>

                      <small>
                        {[delivery.deliveryCity, delivery.deliveryZipCode]
                          .filter(Boolean)
                          .join(" · ")}
                      </small>
                    </div>
                  </div>

                  {delivery.notes && (
                    <div className="admin-delivery-notes">
                      <span>Notes</span>

                      <p>{delivery.notes}</p>
                    </div>
                  )}

                  <div className="admin-delivery-progress">
                    {[
                      ["assigned", "Assigned"],
                      ["accepted", "Accepted"],
                      ["picked_up", "Picked Up"],
                      ["in_transit", "In Transit"],
                      ["delivered", "Delivered"],
                    ].map(([step, label], index) => {
                      const steps = [
                        "assigned",
                        "accepted",
                        "picked_up",
                        "in_transit",
                        "delivered",
                      ];

                      const currentIndex = steps.indexOf(delivery.status);

                      const stepIndex = steps.indexOf(step);

                      const done = currentIndex >= stepIndex;

                      return (
                        <div className="admin-progress-wrapper" key={step}>
                          <div
                            className={`admin-progress-step ${
                              done ? "done" : ""
                            }`}
                          >
                            <span />
                            <small>{label}</small>
                          </div>

                          {index < steps.length - 1 && (
                            <div
                              className={`admin-progress-line ${
                                currentIndex > stepIndex ? "done" : ""
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDeliveries;
