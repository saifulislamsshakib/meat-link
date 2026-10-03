import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SlaughterhouseProductManagement.css";

function SlaughterhouseProductManagement() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setError("");

      const response = await api.get("/meat-products/my-products");

      const activeProducts = (response.data.products || []).filter(
        (product) => !product.isArchived,
      );

      setProducts(activeProducts);
    } catch (error) {
      console.error("Failed to load meat products:", error);

      setError(
        error.response?.data?.message || "Failed to load meat products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateProcessing = async (productId, processingStatus) => {
    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      await api.patch(`/meat-products/${productId}/processing`, {
        processingStatus,
      });

      await loadProducts();
    } catch (error) {
      console.error("Processing status update failed:", error);

      setError(
        error.response?.data?.message || "Failed to update processing status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const updatePackaging = async (productId, packagingStatus) => {
    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      await api.patch(`/meat-products/${productId}/packaging`, {
        packagingStatus,
      });

      await loadProducts();
    } catch (error) {
      console.error("Packaging status update failed:", error);

      setError(
        error.response?.data?.message || "Failed to update packaging status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const publishProduct = async (productId) => {
    const confirmed = window.confirm(
      "Publish this meat product to Super Shops?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      const response = await api.patch(`/meat-products/${productId}/publish`);

      setSuccess(
        response.data.message || "Meat product published successfully.",
      );

      await loadProducts();
    } catch (error) {
      console.error("Publish product failed:", error);

      setError(
        error.response?.data?.message || "Failed to publish meat product.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const unpublishProduct = async (productId) => {
    const confirmed = window.confirm("Remove this product from Super Shops?");

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      const response = await api.patch(`/meat-products/${productId}/unpublish`);

      setSuccess(
        response.data.message || "Meat product unpublished successfully.",
      );

      await loadProducts();
    } catch (error) {
      console.error("Unpublish product failed:", error);

      setError(
        error.response?.data?.message || "Failed to unpublish meat product.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this product? It will be removed from active product management.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      await api.patch(`/meat-products/${productId}/archive`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId),
      );

      setSuccess("Product archived successfully.");
    } catch (error) {
      console.error("Failed to archive meat product:", error);

      setError(
        error.response?.data?.message || "Failed to archive meat product.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getProcessingAction = (product) => {
    if (product.processingStatus === "pending") {
      return {
        label: "Start Processing",
        status: "processing",
        className: "process-btn",
      };
    }

    if (product.processingStatus === "processing") {
      return {
        label: "Mark as Processed",
        status: "processed",
        className: "processed-btn",
      };
    }

    return null;
  };

  const getPackagingAction = (product) => {
    if (product.processingStatus !== "processed") {
      return null;
    }

    if (product.packagingStatus === "pending") {
      return {
        label: "Package Product",
        status: "packaged",
        className: "package-btn",
      };
    }

    return null;
  };

  if (loading) {
    return (
      <div className="product-management-loading">Loading meat products...</div>
    );
  }

  return (
    <div className="product-management-page">
      <div className="product-management-container">
        <div className="product-management-header">
          <div>
            <span>Slaughterhouse</span>

            <h1>Meat Product Management</h1>

            <p>
              Manage processing, packaging and publishing of your meat products.
            </p>
          </div>

          <div className="product-header-actions">
            {/* <button
              type="button"
              className="new-product-btn"
              onClick={() => navigate("/slaughterhouse/products")}
            >
              + Create Product
            </button> */}

            <button
              type="button"
              className="product-back-btn"
              onClick={() => navigate("/slaughterhouse/dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {error && <div className="product-management-error">{error}</div>}

        {success && <div className="product-management-success">{success}</div>}

        {products.length === 0 ? (
          <div className="no-products-card">
            <div className="no-products-icon">🥩</div>

            <h2>No Active Meat Products</h2>

            <p>You currently have no active meat products to manage.</p>

            <button
              type="button"
              className="new-product-btn"
              onClick={() => navigate("/slaughterhouse/products")}
            >
              Create Meat Product
            </button>
          </div>
        ) : (
          <div className="product-list">
            {products.map((product) => {
              const processingAction = getProcessingAction(product);

              const packagingAction = getPackagingAction(product);

              const canPublish =
                product.processingStatus === "processed" &&
                product.packagingStatus === "packaged" &&
                Number(product.quantity || 0) > 0 &&
                !product.isPublished;

              const canArchive =
                product.processingStatus === "processed" &&
                product.packagingStatus === "packaged" &&
                Number(product.quantity || 0) === 0;

              return (
                <div className="product-card" key={product._id}>
                  <div className="product-card-header">
                    <div>
                      <span className="product-label">MEAT PRODUCT</span>

                      <h2>{product.productName}</h2>

                      <p>{product.meatType}</p>
                    </div>

                    <div className="product-price">
                      ৳ {Number(product.pricePerKg || 0).toLocaleString()}
                      <small>/ kg</small>
                    </div>
                  </div>

                  <div className="product-info-grid">
                    <div className="product-info">
                      <span>Quantity</span>

                      <strong>{product.quantity} kg</strong>
                    </div>

                    <div className="product-info">
                      <span>Processing</span>

                      <strong
                        className={`status-pill ${product.processingStatus}`}
                      >
                        {product.processingStatus}
                      </strong>
                    </div>

                    <div className="product-info">
                      <span>Packaging</span>

                      <strong
                        className={`status-pill ${product.packagingStatus}`}
                      >
                        {product.packagingStatus}
                      </strong>
                    </div>

                    <div className="product-info">
                      <span>Published</span>

                      <strong
                        className={`status-pill ${
                          product.isPublished ? "published" : "unpublished"
                        }`}
                      >
                        {product.isPublished ? "Published" : "Unpublished"}
                      </strong>
                    </div>

                    <div className="product-info">
                      <span>Created</span>

                      <strong>
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString(
                              "en-GB",
                            )
                          : "N/A"}
                      </strong>
                    </div>
                  </div>

                  {product.description && (
                    <div className="product-description">
                      <span>Description</span>

                      <p>{product.description}</p>
                    </div>
                  )}

                  <div className="product-actions">
                    {processingAction && (
                      <button
                        type="button"
                        className={processingAction.className}
                        disabled={actionLoading === product._id}
                        onClick={() =>
                          updateProcessing(product._id, processingAction.status)
                        }
                      >
                        {actionLoading === product._id
                          ? "Updating..."
                          : processingAction.label}
                      </button>
                    )}

                    {packagingAction && (
                      <button
                        type="button"
                        className={packagingAction.className}
                        disabled={actionLoading === product._id}
                        onClick={() =>
                          updatePackaging(product._id, packagingAction.status)
                        }
                      >
                        {actionLoading === product._id
                          ? "Updating..."
                          : packagingAction.label}
                      </button>
                    )}

                    {canPublish && (
                      <button
                        type="button"
                        className="publish-btn"
                        disabled={actionLoading === product._id}
                        onClick={() => publishProduct(product._id)}
                      >
                        {actionLoading === product._id
                          ? "Publishing..."
                          : "Publish to Super Shops"}
                      </button>
                    )}

                    {product.isPublished && (
                      <>
                        <div className="ready-badge">
                          ✓ Visible to Super Shops
                        </div>

                        <button
                          type="button"
                          className="unpublish-btn"
                          disabled={actionLoading === product._id}
                          onClick={() => unpublishProduct(product._id)}
                        >
                          {actionLoading === product._id
                            ? "Updating..."
                            : "Unpublish"}
                        </button>
                      </>
                    )}

                    {canArchive && (
                      <button
                        type="button"
                        className="product-archive-btn"
                        disabled={actionLoading === product._id}
                        onClick={() => handleArchiveProduct(product._id)}
                      >
                        {actionLoading === product._id
                          ? "Archiving..."
                          : "Archive Product"}
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

export default SlaughterhouseProductManagement;
