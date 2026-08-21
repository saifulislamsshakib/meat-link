import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EditLivestock.css";

function EditLivestock() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    animalType: "",
    breed: "",
    quantity: "",
    availableQuantity: "",
    pricePerAnimal: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadLivestock = async () => {
      try {
        setError("");

        const response = await api.get(`/livestock/${id}`);

        const livestock = response.data.livestock;

        if (!livestock) {
          setError("Livestock not found.");
          return;
        }

        setFormData({
          animalType: livestock.animalType || "",
          breed: livestock.breed || "",
          quantity: livestock.quantity ?? "",
          availableQuantity: livestock.availableQuantity ?? "",
          pricePerAnimal: livestock.pricePerAnimal ?? "",
          location: livestock.location || "",
          description: livestock.description || "",
        });
      } catch (error) {
        console.error("Failed to load livestock:", error);

        setError(error.response?.data?.message || "Failed to load livestock.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLivestock();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.animalType ||
      !formData.breed ||
      !formData.quantity ||
      !formData.availableQuantity ||
      formData.pricePerAnimal === "" ||
      !formData.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      Number(formData.quantity) < 0 ||
      Number(formData.availableQuantity) < 0
    ) {
      setError("Quantity cannot be negative.");
      return;
    }

    if (Number(formData.availableQuantity) > Number(formData.quantity)) {
      setError("Available quantity cannot be greater than total quantity.");
      return;
    }

    if (Number(formData.pricePerAnimal) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(`/livestock/${id}`, {
        animalType: formData.animalType,
        breed: formData.breed,
        quantity: Number(formData.quantity),
        availableQuantity: Number(formData.availableQuantity),
        pricePerAnimal: Number(formData.pricePerAnimal),
        location: formData.location,
        description: formData.description || "",
      });

      setSuccess(response.data.message || "Livestock updated successfully.");

      setTimeout(() => {
        navigate("/farmer/livestock");
      }, 900);
    } catch (error) {
      console.error("Failed to update livestock:", error);

      setError(error.response?.data?.message || "Failed to update livestock.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-livestock-loading">Loading livestock...</div>;
  }

  return (
    <div className="edit-livestock-page">
      <div className="edit-livestock-container">
        <div className="edit-livestock-header">
          <div>
            <span>Farmer</span>

            <h1>Edit Livestock</h1>

            <p>Update your livestock information.</p>
          </div>

          <button
            type="button"
            className="edit-livestock-back"
            onClick={() => navigate("/farmer/livestock")}
          >
            ← My Livestock
          </button>
        </div>

        {error && <div className="edit-livestock-error">{error}</div>}

        {success && <div className="edit-livestock-success">{success}</div>}

        <form className="edit-livestock-card" onSubmit={handleSubmit}>
          <div className="edit-livestock-row">
            <div className="edit-livestock-field">
              <label>Animal Type *</label>

              <select
                name="animalType"
                value={formData.animalType}
                onChange={handleChange}
              >
                <option value="">Select animal type</option>

                <option value="cattle">Cattle</option>

                <option value="goat">Goat</option>

                <option value="sheep">Sheep</option>

                <option value="chicken">Chicken</option>
              </select>
            </div>

            <div className="edit-livestock-field">
              <label>Breed *</label>

              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g. Jersey"
              />
            </div>
          </div>

          <div className="edit-livestock-row">
            <div className="edit-livestock-field">
              <label>Total Quantity *</label>

              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
              />
            </div>

            <div className="edit-livestock-field">
              <label>Available Quantity *</label>

              <input
                type="number"
                name="availableQuantity"
                min="0"
                value={formData.availableQuantity}
                onChange={handleChange}
                placeholder="Enter available quantity"
              />
            </div>
          </div>

          <div className="edit-livestock-row">
            <div className="edit-livestock-field">
              <label>Price Per Animal *</label>

              <input
                type="number"
                name="pricePerAnimal"
                min="0"
                value={formData.pricePerAnimal}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="edit-livestock-field">
              <label>Location *</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Gazipur"
              />
            </div>
          </div>

          <div className="edit-livestock-field">
            <label>Description</label>

            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the livestock..."
            />
          </div>

          <div className="edit-livestock-actions">
            <button
              type="button"
              className="edit-livestock-cancel"
              onClick={() => navigate("/farmer/livestock")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-livestock-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLivestock;
