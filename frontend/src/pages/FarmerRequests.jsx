import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FarmerRequests.css";

function FarmerRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const loadRequests = async () => {
    try {
      setError("");

      const response = await api.get("/procurement-requests/my-requests");

      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Failed to load procurement requests:", error);

      setError(
        error.response?.data?.message || "Failed to load procurement requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      setDriversLoading(true);
      setError("");

      const response = await api.get("/deliveries/drivers");

      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error("Failed to load drivers:", error);

      setError(
        error.response?.data?.message || "Failed to load available drivers.",
      );
    } finally {
      setDriversLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/procurement-requests/${id}/accept`);

      await loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to accept request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/procurement-requests/${id}/reject`);

      await loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reject request.");
    } finally {
      setActionLoading(null);
    }
  };

  const openAssignDriver = async (request) => {
    setSelectedRequest(request);
    setSelectedDriver("");
    setDeliveryNotes("");
    setError("");

    await loadDrivers();
  };

  const closeAssignDriver = () => {
    setSelectedRequest(null);
    setSelectedDriver("");
    setDeliveryNotes("");
  };

  const handleAssignDriver = async () => {
    if (!selectedRequest) return;

    if (!selectedDriver) {
      setError("Please select a driver.");
      return;
    }

    try {
      setActionLoading(selectedRequest._id);
      setError("");

      await api.post("/procurement-requests/assign-driver", {
        procurementRequestId: selectedRequest._id,
        driverId: selectedDriver,
        notes: deliveryNotes.trim(),
      });

      closeAssignDriver();

      await loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to assign driver.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="requests-loading">Loading procurement requests...</div>
    );
  }

  return (
    <div className="farmer-requests-page">
      <div className="requests-container">
        {/* Header */}
        <div className="requests-header">
          <div>
            <span className="requests-label">Farmer</span>

            <h1>Procurement Requests</h1>

            <p>
              Review livestock supply requests from slaughterhouses and arrange
              delivery.
            </p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {/* Error */}
        {error && <div className="requests-error">{error}</div>}

        {/* Requests */}
        {requests.length === 0 ? (
          <div className="empty-request-card">
            <div className="empty-request-icon">📋</div>

            <h2>No Procurement Requests</h2>

            <p>You don't have any procurement requests right now.</p>
          </div>
        ) : (
          <div className="request-list">
            {requests.map((request) => {
              const hasDelivery = request.status === "completed";

              return (
                <div className="request-card" key={request._id}>
                  {/* Card Header */}
                  <div className="request-card-top">
                    <div>
                      <span className="request-type">Procurement Request</span>

                      <h2>{request.livestock?.animalType || "Livestock"}</h2>
                    </div>

                    <span className={`request-status ${request.status}`}>
                      {request.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="request-details">
                    <div className="request-detail">
                      <span>Slaughterhouse</span>

                      <strong>
                        {request.slaughterhouse?.firstName || "Unknown"}{" "}
                        {request.slaughterhouse?.lastName || ""}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>Breed</span>

                      <strong>{request.livestock?.breed || "N/A"}</strong>
                    </div>

                    <div className="request-detail">
                      <span>Requested Quantity</span>

                      <strong>{request.requestedQuantity}</strong>
                    </div>

                    <div className="request-detail">
                      <span>Price / Animal</span>

                      <strong>
                        ৳ {Number(request.pricePerAnimal || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>Total Price</span>

                      <strong>
                        ৳ {Number(request.totalPrice || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>Pickup Location</span>

                      <strong>{request.livestock?.location || "N/A"}</strong>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="request-message">
                      <span>Message</span>

                      <p>{request.message}</p>
                    </div>
                  )}

                  {/* Pending Actions */}
                  {request.status === "pending" && (
                    <div className="request-actions">
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(request._id)}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id
                          ? "Processing..."
                          : "Reject"}
                      </button>

                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(request._id)}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id
                          ? "Processing..."
                          : "Accept Request"}
                      </button>
                    </div>
                  )}

                  {/* Accepted */}
                  {request.status === "accepted" && (
                    <div className="accepted-delivery-section">
                      <div className="accepted-info">
                        <div className="accepted-icon">✓</div>

                        <div>
                          <strong>Procurement Request Accepted</strong>

                          <p>
                            Arrange a driver to deliver this livestock to the
                            slaughterhouse.
                          </p>
                        </div>
                      </div>

                      <button
                        className="assign-driver-btn"
                        onClick={() => openAssignDriver(request)}
                        disabled={actionLoading === request._id}
                      >
                        🚚 Assign Driver
                      </button>
                    </div>
                  )}

                  {/* Completed */}
                  {hasDelivery && (
                    <div className="completed-delivery">
                      <span>✓</span>

                      <div>
                        <strong>Procurement Completed</strong>

                        <p>The livestock delivery has been completed.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {selectedRequest && (
        <div className="driver-modal-overlay" onClick={closeAssignDriver}>
          <div
            className="driver-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="driver-modal-header">
              <div>
                <span>DELIVERY</span>

                <h2>Assign Driver</h2>

                <p>Choose a driver for this livestock delivery.</p>
              </div>

              <button className="modal-close-btn" onClick={closeAssignDriver}>
                ×
              </button>
            </div>

            {/* Delivery Summary */}
            <div className="delivery-summary">
              <div>
                <span>Livestock</span>

                <strong>
                  {selectedRequest.livestock?.animalType || "Livestock"}
                </strong>
              </div>

              <div>
                <span>Quantity</span>

                <strong>{selectedRequest.requestedQuantity}</strong>
              </div>

              <div>
                <span>Pickup</span>

                <strong>{selectedRequest.livestock?.location || "N/A"}</strong>
              </div>

              <div>
                <span>Destination</span>

                <strong>
                  {selectedRequest.slaughterhouse?.address || "N/A"}
                </strong>
              </div>
            </div>

            {/* Drivers */}
            <div className="driver-selection">
              <label>Select Driver</label>

              {driversLoading ? (
                <div className="drivers-loading">
                  Loading available drivers...
                </div>
              ) : drivers.length === 0 ? (
                <div className="no-drivers">
                  <span>🚚</span>

                  <p>No drivers are currently available.</p>
                </div>
              ) : (
                <div className="driver-list">
                  {drivers.map((driver) => (
                    <label
                      className={`driver-option ${
                        selectedDriver === driver._id ? "selected" : ""
                      }`}
                      key={driver._id}
                    >
                      <input
                        type="radio"
                        name="driver"
                        value={driver._id}
                        checked={selectedDriver === driver._id}
                        onChange={(event) =>
                          setSelectedDriver(event.target.value)
                        }
                      />

                      <div className="driver-option-avatar">
                        {driver.firstName?.charAt(0)?.toUpperCase() || "D"}
                      </div>

                      <div className="driver-option-info">
                        <strong>
                          {driver.firstName} {driver.lastName}
                        </strong>

                        <span>
                          {driver.phoneNo || driver.email || "Driver"}
                        </span>
                      </div>

                      <div className="driver-radio">
                        {selectedDriver === driver._id && "✓"}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="delivery-notes-field">
              <label htmlFor="delivery-notes">Delivery Notes</label>

              <textarea
                id="delivery-notes"
                value={deliveryNotes}
                onChange={(event) => setDeliveryNotes(event.target.value)}
                placeholder="Add any instructions for the driver..."
                rows="3"
              />
            </div>

            {/* Modal Actions */}
            <div className="driver-modal-actions">
              <button className="modal-cancel-btn" onClick={closeAssignDriver}>
                Cancel
              </button>

              <button
                className="modal-assign-btn"
                onClick={handleAssignDriver}
                disabled={
                  !selectedDriver || actionLoading === selectedRequest._id
                }
              >
                {actionLoading === selectedRequest._id
                  ? "Assigning..."
                  : "Assign Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerRequests;
