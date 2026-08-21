import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseProcurement.css";

function SlaughterhouseProcurement() {
  const navigate = useNavigate();

  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    livestockId: "",
    requestedQuantity: "",
    message: "",
  });

  useEffect(() => {
    const loadLivestock = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/livestock/available");

        console.log("Available livestock:", response.data.livestock);

        setLivestock(
          Array.isArray(response.data.livestock) ? response.data.livestock : [],
        );
      } catch (error) {
        console.error("Failed to load livestock:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load available livestock.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLivestock();
  }, []);

  const selectedLivestock = livestock.find(
    (item) => item._id === formData.livestockId,
  );

  const availableQuantity = Number(selectedLivestock?.availableQuantity || 0);

  const requestedQuantity = Number(formData.requestedQuantity || 0);

  const pricePerAnimal = Number(selectedLivestock?.pricePerAnimal || 0);

  const totalPrice = requestedQuantity * pricePerAnimal;

  const farmerName = selectedLivestock?.farmer
    ? `${selectedLivestock.farmer.firstName || ""} ${
        selectedLivestock.farmer.lastName || ""
      }`.trim()
    : "";

  const handleLivestockChange = (e) => {
    const livestockId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      livestockId,
      requestedQuantity: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedLivestock) {
      setError("Please select livestock.");
      return;
    }

    if (requestedQuantity < 1) {
      setError("Requested quantity must be at least 1.");
      return;
    }

    if (requestedQuantity > availableQuantity) {
      setError(`Only ${availableQuantity} animals are available.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/procurement-requests", {
        farmerId: selectedLivestock.farmer._id,
        livestockId: selectedLivestock._id,
        requestedQuantity,
        message: formData.message || "We need livestock for meat processing.",
      });

      console.log("Procurement request created:", response.data);

      setSuccess("Procurement request sent successfully.");

      setFormData({
        livestockId: "",
        requestedQuantity: "",
        message: "",
      });
    } catch (error) {
      console.error("Procurement request failed:", error);

      setError(
        error.response?.data?.message || "Failed to send procurement request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="sh-procurement-loading">
        Loading available livestock...
      </div>
    );
  }

  return (
    <div className="sh-procurement-page">
      <div className="sh-procurement-container">
        {/* Header */}
        <div className="sh-procurement-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Livestock Procurement</h1>

            <p>
              Request livestock from registered farmers for meat processing.
            </p>
          </div>

          <button
            type="button"
            className="sh-procurement-back"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {/* Messages */}
        {error && <div className="sh-procurement-error">{error}</div>}

        {success && <div className="sh-procurement-success">{success}</div>}

        {/* Available Livestock Preview */}
        <div className="available-livestock-section">
          <div className="available-section-header">
            <div>
              <h2>Available Livestock</h2>
              <p>Select one of the available livestock below.</p>
            </div>

            <span className="available-count">
              {livestock.length} available
            </span>
          </div>

          {livestock.length === 0 ? (
            <div className="no-livestock-inline">
              No livestock is currently available.
            </div>
          ) : (
            <div className="available-livestock-grid">
              {livestock.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  className={`livestock-option-card ${
                    formData.livestockId === item._id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      livestockId: item._id,
                      requestedQuantity: "",
                    }))
                  }
                >
                  <div className="livestock-option-icon">🐄</div>

                  <div className="livestock-option-info">
                    <strong>{item.animalType}</strong>

                    <span>{item.breed}</span>

                    <small>
                      Farmer: {item.farmer?.firstName || ""}{" "}
                      {item.farmer?.lastName || ""}
                    </small>
                  </div>

                  <div className="livestock-option-price">
                    <strong>
                      ৳ {Number(item.pricePerAnimal || 0).toLocaleString()}
                    </strong>

                    <span>{item.availableQuantity} available</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="sh-procurement-card">
          <form onSubmit={handleSubmit}>
            <div className="sh-form-grid">
              {/* Select */}
              <div className="sh-form-field full-width">
                <label>Selected Livestock</label>

                <select
                  value={formData.livestockId}
                  onChange={handleLivestockChange}
                  required
                >
                  <option value="">Select livestock</option>

                  {livestock.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.animalType} - {item.breed} |{" "}
                      {item.availableQuantity} available | ৳
                      {Number(item.pricePerAnimal || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Farmer */}
              <div className="sh-form-field">
                <label>Farmer</label>

                <input
                  type="text"
                  value={farmerName}
                  placeholder="Select livestock first"
                  readOnly
                />
              </div>

              {/* Location */}
              <div className="sh-form-field">
                <label>Location</label>

                <input
                  type="text"
                  value={selectedLivestock?.location || ""}
                  placeholder="Select livestock first"
                  readOnly
                />
              </div>

              {/* Available */}
              <div className="sh-form-field">
                <label>Available Quantity</label>

                <input
                  type="number"
                  value={selectedLivestock ? availableQuantity : ""}
                  placeholder="0"
                  readOnly
                />
              </div>

              {/* Requested */}
              <div className="sh-form-field">
                <label>Requested Quantity</label>

                <input
                  type="number"
                  name="requestedQuantity"
                  min="1"
                  max={availableQuantity || 1}
                  value={formData.requestedQuantity}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
              </div>

              {/* Price */}
              <div className="sh-form-field">
                <label>Price Per Animal</label>

                <input
                  type="text"
                  value={
                    selectedLivestock
                      ? `৳ ${pricePerAnimal.toLocaleString()}`
                      : ""
                  }
                  placeholder="Select livestock first"
                  readOnly
                />
              </div>

              {/* Total */}
              <div className="sh-form-field">
                <label>Total Price</label>

                <input
                  type="text"
                  value={
                    selectedLivestock && requestedQuantity
                      ? `৳ ${totalPrice.toLocaleString()}`
                      : ""
                  }
                  placeholder="Calculated automatically"
                  readOnly
                />
              </div>

              {/* Message */}
              <div className="sh-form-field full-width">
                <label>Message</label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write a message to the farmer..."
                  rows="5"
                />
              </div>
            </div>

            <div className="sh-procurement-actions">
              <button
                type="button"
                className="sh-procurement-cancel"
                onClick={() => navigate("/slaughterhouse/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="sh-procurement-submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Procurement Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SlaughterhouseProcurement;
