import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseMeatProducts.css";

function SlaughterhouseMeatProducts() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    procurementRequestId: "",
    productName: "",
    meatType: "beef",
    quantity: "",
    pricePerKg: "",
    description: "",
  });

  useEffect(() => {
    const loadAcceptedRequests = async () => {
      try {
        const response = await api.get(
          "/procurement-requests/my-sent-requests",
        );

        const acceptedRequests = (response.data.requests || []).filter(
          (request) => request.status === "accepted",
        );

        setRequests(acceptedRequests);
      } catch (error) {
        console.error("Failed to load procurement requests:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load accepted procurement requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAcceptedRequests();
  }, []);

  const selectedRequest = useMemo(() => {
    return requests.find(
      (request) => request._id === formData.procurementRequestId,
    );
  }, [requests, formData.procurementRequestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleRequestChange = (e) => {
    const requestId = e.target.value;

    const request = requests.find((item) => item._id === requestId);

    setFormData((prev) => ({
      ...prev,
      procurementRequestId: requestId,
      quantity: request?.requestedQuantity?.toString() || "",
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedRequest) {
      setError("Please select an accepted procurement request.");
      return;
    }

    if (!formData.productName.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (formData.pricePerKg === "" || Number(formData.pricePerKg) < 0) {
      setError("Please enter a valid price per kg.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/meat-products", {
        procurementRequestId: formData.procurementRequestId,

        productName: formData.productName.trim(),

        meatType: formData.meatType,

        quantity: Number(formData.quantity),

        pricePerKg: Number(formData.pricePerKg),

        description: formData.description.trim(),
      });

      console.log("Meat product created:", response.data);

      setSuccess("Meat product created successfully.");

      setFormData({
        procurementRequestId: "",
        productName: "",
        meatType: "beef",
        quantity: "",
        pricePerKg: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create meat product:", error);

      setError(
        error.response?.data?.message || "Failed to create meat product.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="sh-meat-products-loading">
        Loading accepted procurement requests...
      </div>
    );
  }

  return (
    <div className="sh-meat-products-page">
      <div className="sh-meat-products-container">
        {/* Header */}
        <div className="sh-meat-products-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Meat Products</h1>

            <p>Create meat products from accepted procurement requests.</p>
          </div>

          <button
            type="button"
            className="sh-meat-back-btn"
            onClick={() => navigate("/slaughterhouse/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="sh-meat-error">{error}</div>}

        {success && <div className="sh-meat-success">{success}</div>}

        {/* No accepted request */}
        {requests.length === 0 ? (
          <div className="sh-no-accepted-request">
            <div className="sh-empty-icon">🐄</div>

            <h2>No Accepted Procurement Requests</h2>

            <p>
              You need an accepted farmer procurement request before creating a
              meat product.
            </p>

            <button
              type="button"
              className="sh-primary-btn"
              onClick={() => navigate("/slaughterhouse/procurement-requests")}
            >
              View Procurement Requests
            </button>
          </div>
        ) : (
          <div className="sh-meat-product-card">
            <form onSubmit={handleSubmit}>
              <div className="sh-meat-form-grid">
                {/* Procurement Request */}
                <div className="sh-meat-form-field full-width">
                  <label>Accepted Procurement Request</label>

                  <select
                    value={formData.procurementRequestId}
                    onChange={handleRequestChange}
                    required
                  >
                    <option value="">Select accepted request</option>

                    {requests.map((request) => (
                      <option key={request._id} value={request._id}>
                        {request.livestock?.animalType} -{" "}
                        {request.livestock?.breed} | Qty:{" "}
                        {request.requestedQuantity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Farmer info */}
                <div className="sh-meat-form-field">
                  <label>Farmer</label>

                  <input
                    type="text"
                    readOnly
                    value={
                      selectedRequest?.farmer
                        ? `${selectedRequest.farmer.firstName || ""} ${
                            selectedRequest.farmer.lastName || ""
                          }`.trim()
                        : ""
                    }
                    placeholder="Select request first"
                  />
                </div>

                {/* Source livestock */}
                <div className="sh-meat-form-field">
                  <label>Source Livestock</label>

                  <input
                    type="text"
                    readOnly
                    value={
                      selectedRequest
                        ? `${selectedRequest.livestock?.animalType || ""} - ${
                            selectedRequest.livestock?.breed || ""
                          }`
                        : ""
                    }
                    placeholder="Select request first"
                  />
                </div>

                {/* Product Name */}
                <div className="sh-meat-form-field">
                  <label>Product Name</label>

                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Premium Beef"
                    required
                  />
                </div>

                {/* Meat Type */}
                <div className="sh-meat-form-field">
                  <label>Meat Type</label>

                  <select
                    name="meatType"
                    value={formData.meatType}
                    onChange={handleChange}
                    required
                  >
                    <option value="beef">Beef</option>

                    <option value="mutton">Mutton</option>

                    <option value="goat">Goat</option>

                    <option value="buffalo">Buffalo</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="sh-meat-form-field">
                  <label>Quantity (kg)</label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="10"
                    required
                  />
                </div>

                {/* Price */}
                <div className="sh-meat-form-field">
                  <label>Price Per Kg</label>

                  <input
                    type="number"
                    name="pricePerKg"
                    min="0"
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    placeholder="850"
                    required
                  />
                </div>

                {/* Description */}
                <div className="sh-meat-form-field full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the meat product..."
                    rows="5"
                  />
                </div>
              </div>

              <div className="sh-meat-actions">
                <button
                  type="button"
                  className="sh-meat-cancel-btn"
                  onClick={() => navigate("/slaughterhouse/dashboard")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sh-meat-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Meat Product"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlaughterhouseMeatProducts;
