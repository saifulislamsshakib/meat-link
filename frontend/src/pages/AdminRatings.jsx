import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminRatings.css";

function AdminRatings() {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRatings = async () => {
      try {
        setError("");

        const response = await api.get("/ratings/all");

        setRatings(response.data.ratings || []);

        setAverageRating(Number(response.data.averageRating || 0));
      } catch (error) {
        console.error("Failed to load ratings:", error);

        setError(error.response?.data?.message || "Failed to load ratings.");
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="admin-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Number(rating) ? "filled" : "empty"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="admin-ratings-loading">Loading ratings...</div>;
  }

  return (
    <div className="admin-ratings-page">
      <div className="admin-ratings-container">
        {/* Header */}
        <div className="admin-ratings-header">
          <div>
            <span>Administration</span>

            <h1>Ratings & Reviews</h1>

            <p>Monitor customer feedback and ratings across MeatLink.</p>
          </div>

          <button
            type="button"
            className="admin-ratings-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-ratings-error">{error}</div>}

        {/* Summary */}
        <div className="admin-ratings-summary">
          <div className="admin-rating-summary-card">
            <span>Total Ratings</span>

            <strong>{ratings.length}</strong>
          </div>

          <div className="admin-rating-summary-card">
            <span>Average Rating</span>

            <strong className="green">⭐ {averageRating.toFixed(1)}</strong>
          </div>

          <div className="admin-rating-summary-card">
            <span>5 Star Ratings</span>

            <strong>
              {ratings.filter((item) => Number(item.rating) === 5).length}
            </strong>
          </div>

          <div className="admin-rating-summary-card">
            <span>Low Ratings</span>

            <strong className="warning">
              {ratings.filter((item) => Number(item.rating) <= 2).length}
            </strong>
          </div>
        </div>

        {/* Rating List */}
        {ratings.length === 0 ? (
          <div className="admin-ratings-empty">
            <div>⭐</div>

            <h2>No Ratings Yet</h2>

            <p>
              Customer ratings will appear here after Super Shops review
              delivered orders.
            </p>
          </div>
        ) : (
          <div className="admin-ratings-list">
            {ratings.map((item) => (
              <div className="admin-rating-card" key={item._id}>
                {/* Header */}
                <div className="admin-rating-card-header">
                  <div>
                    <span className="admin-rating-label">CUSTOMER REVIEW</span>

                    <h2>
                      {item.superShop
                        ? `${item.superShop.firstName || ""} ${
                            item.superShop.lastName || ""
                          }`
                        : "Super Shop"}
                    </h2>

                    <p>{item.superShop?.email || "N/A"}</p>
                  </div>

                  <div className="admin-rating-value">
                    {renderStars(item.rating)}

                    <strong>{item.rating}/5</strong>
                  </div>
                </div>

                {/* Main Details */}
                <div className="admin-rating-grid">
                  <div>
                    <span>Slaughterhouse</span>

                    <strong>
                      {item.slaughterhouse
                        ? `${item.slaughterhouse.firstName || ""} ${
                            item.slaughterhouse.lastName || ""
                          }`
                        : "N/A"}
                    </strong>

                    <small>{item.slaughterhouse?.email || ""}</small>
                  </div>

                  <div>
                    <span>Order ID</span>

                    <strong>{item.order?._id || "N/A"}</strong>
                  </div>

                  <div>
                    <span>Quantity</span>

                    <strong>{item.order?.quantity || 0} kg</strong>
                  </div>

                  <div>
                    <span>Order Status</span>

                    <strong>{item.order?.status || "N/A"}</strong>
                  </div>
                </div>

                {/* Feedback */}
                <div className="admin-rating-feedback">
                  <span>Feedback</span>

                  <p>
                    {item.feedback
                      ? item.feedback
                      : "No written feedback provided."}
                  </p>
                </div>

                {/* Footer */}
                <div className="admin-rating-footer">
                  <div>
                    <span>Date</span>

                    <strong>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Total Order Value</span>

                    <strong className="green-text">
                      ৳ {Number(item.order?.totalPrice || 0).toLocaleString()}
                    </strong>
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

export default AdminRatings;
