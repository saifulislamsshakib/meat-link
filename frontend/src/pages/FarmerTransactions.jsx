import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FarmerTransactions.css";

function FarmerTransactions() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await api.get("/procurement-requests/my-requests");

        setRequests(response.data.requests || []);
      } catch (error) {
        console.error("Failed to load transaction history:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load transaction history.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const getStatusClass = (status) => {
    return `transaction-status ${status || ""}`;
  };

  if (loading) {
    return (
      <div className="transactions-loading">Loading transaction history...</div>
    );
  }

  return (
    <div className="farmer-transactions-page">
      <div className="transactions-container">
        <div className="transactions-header">
          <div>
            <span>Farmer</span>
            <h1>Transaction History</h1>
            <p>
              View your livestock procurement history and transaction details.
            </p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="transactions-error">{error}</div>}

        {requests.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-icon">📋</div>

            <h2>No Transaction History</h2>

            <p>Your procurement transaction history will appear here.</p>
          </div>
        ) : (
          <div className="transactions-card">
            <div className="transactions-table-header">
              <span>Date</span>
              <span>Slaughterhouse</span>
              <span>Livestock</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Status</span>
            </div>

            {requests.map((request) => (
              <div className="transactions-row" key={request._id}>
                <span className="transaction-date">
                  {new Date(request.createdAt).toLocaleDateString("en-GB")}
                </span>

                <span>
                  <strong>
                    {request.slaughterhouse?.firstName || "Unknown"}{" "}
                    {request.slaughterhouse?.lastName || ""}
                  </strong>

                  <small>{request.slaughterhouse?.email || ""}</small>
                </span>

                <span>
                  <strong className="capitalize">
                    {request.livestock?.animalType || "N/A"}
                  </strong>

                  <small>{request.livestock?.breed || "N/A"}</small>
                </span>

                <span>{request.requestedQuantity}</span>

                <span>
                  <strong>
                    ৳ {Number(request.totalPrice || 0).toLocaleString()}
                  </strong>

                  <small>
                    ৳ {Number(request.pricePerAnimal || 0).toLocaleString()} /
                    animal
                  </small>
                </span>

                <span>
                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="transactions-summary">
          <div className="summary-box">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="summary-box">
            <span>Accepted</span>
            <strong>
              {requests.filter((item) => item.status === "accepted").length}
            </strong>
          </div>

          <div className="summary-box">
            <span>Pending</span>
            <strong>
              {requests.filter((item) => item.status === "pending").length}
            </strong>
          </div>

          <div className="summary-box">
            <span>Rejected</span>
            <strong>
              {requests.filter((item) => item.status === "rejected").length}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerTransactions;
