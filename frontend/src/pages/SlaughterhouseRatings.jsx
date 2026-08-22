import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseRatings.css";

function SlaughterhouseRatings() {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRatings = async () => {
      try {
        setError("");

        const response = await api.get("/ratings/slaughterhouse");

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

  if (loading) {
    return (
      <div className="slaughterhouse-ratings-loading">Loading ratings...</div>
    );
  }

  return (
    <div className="slaughterhouse-ratings-page">
      <div className="slaughterhouse-ratings-container">
        <div className="slaughterhouse-ratings-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Customer Ratings</h1>

            <p>
              Review feedback submitted by Super Shops for your delivered
              orders.
            </p>
          </div>

          <button
            type="button"
            className="slaughterhouse-ratings-back"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="slaughterhouse-ratings-error">{error}</div>}

        <div className="slaughterhouse-rating-summary">
          <div className="slaughterhouse-rating-summary-card">
            <span>Average Rating</span>

            <strong>⭐ {averageRating.toFixed(1)}</strong>
          </div>

          <div className="slaughterhouse-rating-summary-card">
            <span>Total Ratings</span>

            <strong>{ratings.length}</strong>
          </div>
        </div>

        {ratings.length === 0 ? (
          <div className="slaughterhouse-ratings-empty">
            <div>⭐</div>

            <h2>No Ratings Yet</h2>

            <p>
              Ratings from Super Shops will appear here after delivered orders
              are reviewed.
            </p>
          </div>
        ) : (
          <div className="slaughterhouse-ratings-list">
            {ratings.map((item) => (
              <div className="slaughterhouse-rating-card" key={item._id}>
                <div className="slaughterhouse-rating-card-header">
                  <div>
                    <span className="rating-card-label">CUSTOMER REVIEW</span>

                    <h2>
                      {item.superShop
                        ? `${item.superShop.firstName || ""} ${
                            item.superShop.lastName || ""
                          }`
                        : "Super Shop"}
                    </h2>

                    <p>{item.superShop?.email || ""}</p>
                  </div>

                  <div className="rating-stars-view">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= Number(item.rating) ? "filled" : "empty"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {item.feedback && (
                  <div className="rating-feedback-box">
                    <span>Feedback</span>

                    <p>{item.feedback}</p>
                  </div>
                )}

                <div className="rating-meta">
                  <div>
                    <span>Order</span>

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

                  <div>
                    <span>Date</span>

                    <strong>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
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

export default SlaughterhouseRatings;
