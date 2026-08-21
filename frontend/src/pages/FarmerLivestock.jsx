import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./FarmerLivestock.css";

function FarmerLivestock() {
  const navigate = useNavigate();

  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadLivestock = async () => {
    try {
      setError("");

      const response = await api.get("/livestock");

      setLivestock(response.data.livestock || []);
    } catch (error) {
      console.error("Failed to load livestock:", error);

      setError(error.response?.data?.message || "Failed to load livestock.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLivestock();
  }, []);

  const handleAvailabilityChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await api.patch(`/livestock/${id}/availability`, {
        availabilityStatus: status,
      });

      setLivestock((prev) =>
        prev.map((item) =>
          item._id === id
            ? response.data.livestock || {
                ...item,
                availabilityStatus: status,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to update availability:", error);

      setError(
        error.response?.data?.message || "Failed to update availability.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLivestock = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this unavailable livestock?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/livestock/${id}`);

      setLivestock((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete livestock:", error);

      setError(error.response?.data?.message || "Failed to delete livestock.");
    } finally {
      setDeletingId(null);
    }
  };

  const availableCount = livestock.filter(
    (item) =>
      item.availabilityStatus === "available" ||
      item.availabilityStatus === "partially_available",
  ).length;

  const totalAnimals = livestock.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  if (loading) {
    return <div className="farmer-livestock-loading">Loading livestock...</div>;
  }

  return (
    <div className="farmer-livestock-page">
      <div className="farmer-livestock-container">
        {/* Header */}
        <div className="farmer-livestock-header">
          <div>
            <span className="farmer-livestock-label">Farmer</span>

            <h1>My Livestock</h1>

            <p>View and manage your registered livestock.</p>
          </div>

          <div className="farmer-livestock-actions">
            <button
              type="button"
              className="farmer-back-btn"
              onClick={() => navigate("/farmer/dashboard")}
            >
              ← Dashboard
            </button>

            <button
              type="button"
              className="farmer-add-btn"
              onClick={() => navigate("/farmer/livestock/add")}
            >
              + Add Livestock
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="farmer-livestock-error">{error}</div>}

        {/* Summary */}
        <div className="farmer-livestock-summary">
          <div className="farmer-summary-card">
            <span>Total Records</span>

            <strong>{livestock.length}</strong>
          </div>

          <div className="farmer-summary-card">
            <span>Available</span>

            <strong className="green">{availableCount}</strong>
          </div>

          <div className="farmer-summary-card">
            <span>Total Animals</span>

            <strong>{totalAnimals}</strong>
          </div>
        </div>

        {/* Empty State */}
        {livestock.length === 0 ? (
          <div className="farmer-livestock-empty">
            <div>🐄</div>

            <h2>No Livestock Found</h2>

            <p>You have not added any livestock yet.</p>

            <button
              type="button"
              onClick={() => navigate("/farmer/livestock/add")}
            >
              Add Your First Livestock
            </button>
          </div>
        ) : (
          <div className="farmer-livestock-list">
            {livestock.map((item) => {
              const status = item.availabilityStatus || "available";

              return (
                <div className="farmer-livestock-card" key={item._id}>
                  {/* Card Header */}
                  <div className="farmer-livestock-card-header">
                    <div className="farmer-animal-icon">
                      {item.animalType === "goat"
                        ? "🐐"
                        : item.animalType === "sheep"
                          ? "🐑"
                          : item.animalType === "chicken"
                            ? "🐔"
                            : "🐄"}
                    </div>

                    <div className="farmer-animal-title">
                      <span>{item.animalType || "Animal"}</span>

                      <h2>{item.breed || "Unknown Breed"}</h2>
                    </div>

                    <span className={`farmer-status ${status.toLowerCase()}`}>
                      {status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Information */}
                  <div className="farmer-livestock-grid">
                    <div>
                      <span>Quantity</span>

                      <strong>{item.quantity || 0}</strong>
                    </div>

                    <div>
                      <span>Available Quantity</span>

                      <strong>{item.availableQuantity || 0}</strong>
                    </div>

                    <div>
                      <span>Price / Animal</span>

                      <strong className="green-text">
                        ৳ {Number(item.pricePerAnimal || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>Location</span>

                      <strong>{item.location || "N/A"}</strong>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <div className="farmer-livestock-description">
                      <span>Description</span>

                      <p>{item.description}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="farmer-livestock-footer">
                    <select
                      value={status}
                      disabled={
                        updatingId === item._id || deletingId === item._id
                      }
                      onChange={(e) =>
                        handleAvailabilityChange(item._id, e.target.value)
                      }
                    >
                      <option value="available">Available</option>

                      <option value="partially_available">
                        Partially Available
                      </option>

                      <option value="sold">Sold</option>

                      <option value="unavailable">Unavailable</option>
                    </select>

                    <button
                      type="button"
                      className="farmer-edit-btn"
                      disabled={deletingId === item._id}
                      onClick={() =>
                        navigate(`/farmer/livestock/edit/${item._id}`)
                      }
                    >
                      Edit
                    </button>

                    {status === "unavailable" && (
                      <button
                        type="button"
                        className="farmer-delete-btn"
                        disabled={deletingId === item._id}
                        onClick={() => handleDeleteLivestock(item._id)}
                      >
                        {deletingId === item._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
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

export default FarmerLivestock;
