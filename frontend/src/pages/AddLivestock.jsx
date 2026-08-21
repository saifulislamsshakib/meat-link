import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddLivestock.css";

function AddLivestock() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    animalType: "cattle",
    breed: "",
    quantity: "",
    availableQuantity: "",
    pricePerAnimal: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const quantity = Number(formData.quantity);
    const availableQuantity = Number(formData.availableQuantity);
    const pricePerAnimal = Number(formData.pricePerAnimal);

    if (availableQuantity > quantity) {
      setError("Available quantity cannot be greater than total quantity.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/livestock", {
        animalType: formData.animalType,
        breed: formData.breed,
        quantity,
        availableQuantity,
        pricePerAnimal,
        location: formData.location,
        description: formData.description,
      });

      console.log("Add livestock response:", response.data);

      setSuccess("Livestock added successfully.");

      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Add livestock error:", error);

      setError(error.response?.data?.message || "Failed to add livestock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-livestock-page">
      <div className="add-livestock-card">
        <div className="page-header">
          <div>
            <span>Farmer</span>

            <h1>Add Livestock</h1>

            <p>Register a new livestock item to your inventory.</p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Back
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Animal Type */}
            <div className="form-field">
              <label>Animal Type</label>

              <select
                name="animalType"
                value={formData.animalType}
                onChange={handleChange}
                required
              >
                <option value="cattle">Cattle</option>

                <option value="goat">Goat</option>

                <option value="sheep">Sheep</option>

                <option value="buffalo">Buffalo</option>
              </select>
            </div>

            {/* Breed */}
            <div className="form-field">
              <label>Breed</label>

              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Holstein Friesian"
                required
              />
            </div>

            {/* Quantity */}
            <div className="form-field">
              <label>Total Quantity</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="5"
                required
              />
            </div>

            {/* Available Quantity */}
            <div className="form-field">
              <label>Available Quantity</label>

              <input
                type="number"
                name="availableQuantity"
                min="0"
                value={formData.availableQuantity}
                onChange={handleChange}
                placeholder="5"
                required
              />

              <small>
                Available quantity cannot be greater than total quantity.
              </small>
            </div>

            {/* Price */}
            <div className="form-field">
              <label>Price Per Animal</label>

              <input
                type="number"
                name="pricePerAnimal"
                min="0"
                value={formData.pricePerAnimal}
                onChange={handleChange}
                placeholder="85000"
                required
              />
            </div>

            {/* Location */}
            <div className="form-field">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka"
                required
              />
            </div>

            {/* Description */}
            <div className="form-field full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the livestock..."
                rows="5"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/farmer/dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Add Livestock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLivestock;
