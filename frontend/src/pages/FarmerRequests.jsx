import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FarmerRequests.css";

function FarmerRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="requests-loading">Loading procurement requests...</div>
    );
  }

  return (
    <div className="farmer-requests-page">
      <div className="requests-container">
        <div className="requests-header">
          <div>
            <span className="requests-label">Farmer</span>

            <h1>Procurement Requests</h1>

            <p>Review livestock supply requests from slaughterhouses.</p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="requests-error">{error}</div>}

        {requests.length === 0 ? (
          <div className="empty-request-card">
            <div className="empty-request-icon">📋</div>

            <h2>No Procurement Requests</h2>

            <p>You don't have any procurement requests right now.</p>
          </div>
        ) : (
          <div className="request-list">
            {requests.map((request) => (
              <div className="request-card" key={request._id}>
                <div className="request-card-top">
                  <div>
                    <span className="request-type">Procurement Request</span>

                    <h2>{request.livestock?.animalType || "Livestock"}</h2>
                  </div>

                  <span className={`request-status ${request.status}`}>
                    {request.status}
                  </span>
                </div>

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
                    <span>Location</span>

                    <strong>{request.livestock?.location || "N/A"}</strong>
                  </div>
                </div>

                {request.message && (
                  <div className="request-message">
                    <span>Message</span>

                    <p>{request.message}</p>
                  </div>
                )}

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerRequests;
