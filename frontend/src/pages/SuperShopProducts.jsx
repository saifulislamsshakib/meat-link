import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SuperShopProducts.css";

function SuperShopProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryZipCode, setDeliveryZipCode] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError("");

        const response = await api.get("/meat-products/available");

        setProducts(
          Array.isArray(response.data.products) ? response.data.products : [],
        );
      } catch (error) {
        console.error("Failed to load meat products:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load available meat products.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const availableQuantity = Number(selectedProduct?.quantity || 0);

  const orderedQuantity = Number(quantity || 0);

  const pricePerKg = Number(selectedProduct?.pricePerKg || 0);

  const totalPrice = orderedQuantity * pricePerKg;

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedProduct) {
      setError("Please select a meat product.");
      return;
    }

    if (!orderedQuantity || orderedQuantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (orderedQuantity > availableQuantity) {
      setError(`Only ${availableQuantity} kg is available.`);
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Delivery address is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/meat-orders", {
        meatProductId: selectedProduct._id,
        quantity: orderedQuantity,
        deliveryAddress: deliveryAddress.trim(),
        deliveryCity: deliveryCity.trim(),
        deliveryZipCode: deliveryZipCode.trim(),
        notes: notes.trim(),
      });

      console.log("Meat order response:", response.data);

      setSuccess(
        `Order placed successfully. Remaining stock: ${
          response.data.remainingStock
        } kg`,
      );

      setProducts((prev) =>
        prev
          .map((product) =>
            product._id === selectedProduct._id
              ? {
                  ...product,
                  quantity: Number(response.data.remainingStock),
                }
              : product,
          )
          .filter((product) => Number(product.quantity) > 0),
      );

      setSelectedProduct(null);
      setQuantity("");
      setDeliveryAddress("");
      setDeliveryCity("");
      setDeliveryZipCode("");
      setNotes("");
    } catch (error) {
      console.error("Meat order failed:", error);

      setError(error.response?.data?.message || "Failed to place meat order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="ss-products-loading">Loading meat products...</div>;
  }

  return (
    <div className="ss-products-page">
      <div className="ss-products-container">
        <div className="ss-products-header">
          <div>
            <span>Super Shop</span>

            <h1>Available Meat Products</h1>

            <p>Browse packaged meat and place your order.</p>
          </div>

          <button
            type="button"
            className="ss-products-back"
            onClick={() => navigate("/super-shop/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="ss-products-error">{error}</div>}

        {success && <div className="ss-products-success">{success}</div>}

        <div className="ss-products-layout">
          <div className="ss-product-list">
            <div className="ss-list-header">
              <div>
                <h2>Packaged Meat</h2>
                <p>Products ready for purchase.</p>
              </div>

              <span>{products.length} products</span>
            </div>

            {products.length === 0 ? (
              <div className="ss-products-empty">
                <div>🥩</div>

                <h2>No Meat Products Available</h2>

                <p>
                  There are currently no packaged meat products available for
                  order.
                </p>
              </div>
            ) : (
              <div className="ss-product-cards">
                {products.map((product) => (
                  <button
                    type="button"
                    key={product._id}
                    className={`ss-product-select-card ${
                      selectedProduct?._id === product._id ? "selected" : ""
                    }`}
                    onClick={() => selectProduct(product)}
                  >
                    <div className="ss-product-card-icon">🥩</div>

                    <div className="ss-product-card-info">
                      <h3>{product.productName}</h3>

                      <span>{product.meatType}</span>

                      <small>{product.quantity} kg available</small>
                    </div>

                    <strong>
                      ৳ {Number(product.pricePerKg || 0).toLocaleString()}
                      <small>/kg</small>
                    </strong>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ss-order-card">
            <div className="ss-order-header">
              <span>Place Order</span>

              <h2>
                {selectedProduct
                  ? selectedProduct.productName
                  : "Select a Product"}
              </h2>
            </div>

            {!selectedProduct ? (
              <div className="ss-order-empty">
                <div>🛒</div>

                <p>Select a meat product to continue.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ss-selected-product">
                  <div>
                    <strong>{selectedProduct.productName}</strong>

                    <span>
                      ৳{" "}
                      {Number(selectedProduct.pricePerKg || 0).toLocaleString()}{" "}
                      / kg
                    </span>
                  </div>

                  <small>{availableQuantity} kg available</small>
                </div>

                <div className="ss-form-field">
                  <label>Quantity (kg)</label>

                  <input
                    type="number"
                    min="1"
                    max={availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="10"
                    required
                  />
                </div>

                <div className="ss-form-field">
                  <label>Delivery Address</label>

                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Mirpur, Dhaka"
                    required
                  />
                </div>

                <div className="ss-form-row">
                  <div className="ss-form-field">
                    <label>City</label>

                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Dhaka"
                    />
                  </div>

                  <div className="ss-form-field">
                    <label>Zip Code</label>

                    <input
                      type="text"
                      value={deliveryZipCode}
                      onChange={(e) => setDeliveryZipCode(e.target.value)}
                      placeholder="1216"
                    />
                  </div>
                </div>

                <div className="ss-form-field">
                  <label>Notes</label>

                  <textarea
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Please deliver in the morning..."
                  />
                </div>

                <div className="ss-order-total">
                  <span>Total Price</span>

                  <strong>৳ {totalPrice.toLocaleString()}</strong>
                </div>

                <button
                  type="submit"
                  className="ss-place-order-btn"
                  disabled={submitting}
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperShopProducts;
