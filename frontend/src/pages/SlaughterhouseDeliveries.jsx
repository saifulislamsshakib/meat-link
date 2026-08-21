import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseDeliveries.css";

function SlaughterhouseDeliveries() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    orderId: "",
    driverId: "",
    pickupLocation: "Slaughterhouse, Dhaka",
    notes: "",
  });

  const loadData = async () => {
    try {
      setError("");

      const [ordersResponse, driversResponse] = await Promise.all([
        api.get("/meat-orders/slaughterhouse-orders"),
        api.get("/deliveries/drivers"),
      ]);

      const shippedOrders = (ordersResponse.data.orders || []).filter(
        (order) => order.status === "shipped",
      );

      setOrders(shippedOrders);
      setDrivers(driversResponse.data.drivers || []);
    } catch (error) {
      console.error("Failed to load delivery data:", error);

      setError(
        error.response?.data?.message || "Failed to load delivery data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedOrder = orders.find((order) => order._id === formData.orderId);

  const handleOrderSelect = (e) => {
    const orderId = e.target.value;

    const order = orders.find((item) => item._id === orderId);

    setFormData((prev) => ({
      ...prev,
      orderId,
      notes: order
        ? `Pick up ${
            order.meatProduct?.productName || "meat order"
          } and deliver to ${
            order.deliveryAddress || order.deliveryCity || "customer"
          }`
        : "",
    }));

    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.orderId) {
      setError("Please select a shipped order.");
      return;
    }

    if (!formData.driverId) {
      setError("Please select a driver.");
      return;
    }

    if (!formData.pickupLocation.trim()) {
      setError("Pickup location is required.");
      return;
    }

    setAssigning(formData.orderId);

    try {
      const response = await api.post("/deliveries/assign", {
        orderId: formData.orderId,
        driverId: formData.driverId,
        pickupLocation: formData.pickupLocation.trim(),
        notes: formData.notes.trim(),
      });

      console.log("Driver assignment response:", response.data);

      setSuccess("Driver assigned successfully.");

      setFormData({
        orderId: "",
        driverId: "",
        pickupLocation: "Slaughterhouse, Dhaka",
        notes: "",
      });

      await loadData();
    } catch (error) {
      console.error("Driver assignment failed:", error);

      setError(error.response?.data?.message || "Failed to assign driver.");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="sh-deliveries-loading">Loading delivery data...</div>
    );
  }

  return (
    <div className="sh-deliveries-page">
      <div className="sh-deliveries-container">
        {/* Header */}
        <div className="sh-deliveries-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Delivery Management</h1>

            <p>Assign shipped orders to registered drivers.</p>
          </div>

          <button
            type="button"
            className="sh-delivery-back"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="sh-delivery-error">{error}</div>}

        {success && <div className="sh-delivery-success">{success}</div>}

        {/* Summary */}
        <div className="sh-delivery-summary">
          <div className="sh-delivery-summary-card">
            <span>Shipped Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="sh-delivery-summary-card">
            <span>Registered Drivers</span>
            <strong>{drivers.length}</strong>
          </div>
        </div>

        {/* No shipped orders */}
        {orders.length === 0 ? (
          <div className="sh-no-shipped-orders">
            <div>🚚</div>

            <h2>No Shipped Orders</h2>

            <p>
              There are currently no shipped orders waiting for driver
              assignment.
            </p>

            <button
              type="button"
              onClick={() => navigate("/slaughterhouse/orders")}
            >
              View Meat Orders
            </button>
          </div>
        ) : (
          <>
            {/* Assign Form */}
            <div className="sh-delivery-card">
              <div className="sh-delivery-card-header">
                <div>
                  <span>ASSIGN DELIVERY</span>

                  <h2>Assign Driver to Shipped Order</h2>
                </div>
              </div>

              {drivers.length === 0 ? (
                <div className="sh-no-driver-message">
                  No drivers are registered yet.
                </div>
              ) : (
                <form onSubmit={handleAssign}>
                  <div className="sh-delivery-form-grid">
                    {/* Shipped Order */}
                    <div className="sh-delivery-field full-width">
                      <label>Shipped Order</label>

                      <select
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleOrderSelect}
                        required
                      >
                        <option value="">Select shipped order</option>

                        {orders.map((order) => (
                          <option key={order._id} value={order._id}>
                            {order.meatProduct?.productName || "Meat Product"} —{" "}
                            {order.quantity} kg
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Driver */}
                    <div className="sh-delivery-field full-width">
                      <label>Select Driver</label>

                      <select
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a driver</option>

                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.firstName} {driver.lastName}
                            {driver.email ? ` — ${driver.email}` : ""}
                          </option>
                        ))}
                      </select>

                      <small>
                        Select the driver who will handle this delivery.
                      </small>
                    </div>

                    {/* Pickup */}
                    <div className="sh-delivery-field">
                      <label>Pickup Location</label>

                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Destination */}
                    <div className="sh-delivery-field">
                      <label>Delivery Destination</label>

                      <input
                        type="text"
                        value={
                          selectedOrder
                            ? [
                                selectedOrder.deliveryAddress,
                                selectedOrder.deliveryCity,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            : ""
                        }
                        placeholder="Select an order"
                        readOnly
                      />
                    </div>

                    {/* Quantity */}
                    <div className="sh-delivery-field">
                      <label>Quantity</label>

                      <input
                        type="text"
                        value={
                          selectedOrder ? `${selectedOrder.quantity} kg` : ""
                        }
                        placeholder="Select an order"
                        readOnly
                      />
                    </div>

                    {/* Total */}
                    <div className="sh-delivery-field">
                      <label>Order Total</label>

                      <input
                        type="text"
                        value={
                          selectedOrder
                            ? `৳ ${Number(
                                selectedOrder.totalPrice || 0,
                              ).toLocaleString()}`
                            : ""
                        }
                        placeholder="Select an order"
                        readOnly
                      />
                    </div>

                    {/* Notes */}
                    <div className="sh-delivery-field full-width">
                      <label>Delivery Notes</label>

                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Delivery instructions..."
                      />
                    </div>
                  </div>

                  <div className="sh-delivery-actions">
                    <button
                      type="button"
                      className="sh-delivery-cancel"
                      onClick={() => navigate("/slaughterhouse/dashboard")}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="sh-delivery-submit"
                      disabled={assigning === formData.orderId}
                    >
                      {assigning === formData.orderId
                        ? "Assigning..."
                        : "Assign Driver"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Shipped Orders */}
            <div className="sh-shipped-orders-section">
              <div className="sh-shipped-orders-header">
                <div>
                  <h2>Shipped Orders</h2>

                  <p>Orders ready to be assigned to a driver.</p>
                </div>
              </div>

              <div className="sh-shipped-order-list">
                {orders.map((order) => (
                  <div className="sh-shipped-order-card" key={order._id}>
                    <div>
                      <span>
                        {order.meatProduct?.productName || "Meat Product"}
                      </span>

                      <strong>{order.quantity} kg</strong>

                      <small>
                        {[order.deliveryAddress, order.deliveryCity]
                          .filter(Boolean)
                          .join(", ")}
                      </small>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong className="sh-green-price">
                        ৳ {Number(order.totalPrice || 0).toLocaleString()}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          orderId: order._id,
                          notes: `Pick up ${
                            order.meatProduct?.productName || "meat order"
                          } and deliver to ${
                            order.deliveryAddress ||
                            order.deliveryCity ||
                            "customer"
                          }`,
                        }))
                      }
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SlaughterhouseDeliveries;
