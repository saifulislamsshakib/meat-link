import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseProcurementRequests.css";

function SlaughterhouseProcurementRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await api.get(
          "/procurement-requests/my-sent-requests",
        );

        setRequests(response.data.requests || []);
      } catch (error) {
        console.error("Failed to load sent procurement requests:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load procurement requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const getStatusClass = (status) => {
    return `sh-procurement-status ${status || ""}`;
  };

  const pendingCount = requests.filter(
    (item) => item.status === "pending",
  ).length;

  const acceptedCount = requests.filter(
    (item) => item.status === "accepted",
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "rejected",
  ).length;

  if (loading) {
    return (
      <div className="sh-procurement-requests-loading">
        Loading procurement requests...
      </div>
    );
  }

  return (
    <div className="sh-procurement-requests-page">
      <div className="sh-procurement-requests-container">
        {/* Header */}
        <div className="sh-procurement-requests-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Procurement Requests</h1>

            <p>Track livestock requests sent to farmers.</p>
          </div>

          <div className="sh-procurement-header-actions">
            <button
              className="sh-secondary-btn"
              onClick={() => navigate("/slaughterhouse/procurement")}
            >
              + New Request
            </button>

            <button
              className="sh-back-dashboard-btn"
              onClick={() => navigate("/slaughterhouse/dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {error && <div className="sh-procurement-requests-error">{error}</div>}

        {/* Summary */}
        <div className="sh-procurement-summary">
          <div className="sh-procurement-summary-card">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="sh-procurement-summary-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="sh-procurement-summary-card">
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
          </div>

          <div className="sh-procurement-summary-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        {/* Requests */}
        {requests.length === 0 ? (
          <div className="sh-no-procurement-requests">
            <div className="sh-no-request-icon">📋</div>

            <h2>No Procurement Requests</h2>

            <p>You have not sent any procurement requests yet.</p>

            <button
              className="sh-primary-btn"
              onClick={() => navigate("/slaughterhouse/procurement")}
            >
              Send New Request
            </button>
          </div>
        ) : (
          <div className="sh-procurement-request-list">
            {requests.map((request) => (
              <div className="sh-procurement-request-card" key={request._id}>
                <div className="sh-request-top">
                  <div>
                    <span className="sh-request-label">
                      PROCUREMENT REQUEST
                    </span>

                    <h2>{request.livestock?.animalType || "Livestock"}</h2>

                    <p>{request.livestock?.breed || "Unknown breed"}</p>
                  </div>

                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </div>

                <div className="sh-request-grid">
                  <div>
                    <span>Farmer</span>

                    <strong>
                      {request.farmer?.firstName || "Unknown"}{" "}
                      {request.farmer?.lastName || ""}
                    </strong>

                    <small>{request.farmer?.email || ""}</small>
                  </div>

                  <div>
                    <span>Requested Quantity</span>

                    <strong>{request.requestedQuantity}</strong>
                  </div>

                  <div>
                    <span>Price / Animal</span>

                    <strong>
                      ৳ {Number(request.pricePerAnimal || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Total Price</span>

                    <strong className="green-price">
                      ৳ {Number(request.totalPrice || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>

                    <strong>{request.livestock?.location || "N/A"}</strong>
                  </div>

                  <div>
                    <span>Requested Date</span>

                    <strong>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "N/A"}
                    </strong>
                  </div>
                </div>

                {request.message && (
                  <div className="sh-request-message">
                    <span>Message</span>
                    <p>{request.message}</p>
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

export default SlaughterhouseProcurementRequests;
