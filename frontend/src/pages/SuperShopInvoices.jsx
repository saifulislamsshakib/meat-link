import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SuperShopInvoices.css";

function SuperShopInvoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setError("");

        const response = await api.get("/invoices/my-invoices");

        setInvoices(response.data.invoices || []);
      } catch (error) {
        console.error("Failed to load invoices:", error);

        setError(error.response?.data?.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const totalInvoiceAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount || 0),
    0,
  );

  const openInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeInvoice = () => {
    setSelectedInvoice(null);
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return <div className="ss-invoices-loading">Loading invoices...</div>;
  }

  return (
    <div className="ss-invoices-page">
      <div className="ss-invoices-container">
        {/* Header */}
        <div className="ss-invoices-header">
          <div>
            <span>Super Shop</span>

            <h1>Invoices</h1>

            <p>View your order invoices and payment details.</p>
          </div>

          <button
            type="button"
            className="ss-invoices-back"
            onClick={() => navigate("/super-shop/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="ss-invoices-error">{error}</div>}

        {/* Summary */}
        <div className="ss-invoice-summary">
          <div className="ss-invoice-summary-card">
            <span>Total Invoices</span>

            <strong>{invoices.length}</strong>
          </div>

          <div className="ss-invoice-summary-card">
            <span>Total Amount</span>

            <strong>৳ {totalInvoiceAmount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Invoice List */}
        {invoices.length === 0 ? (
          <div className="ss-invoices-empty">
            <div>📄</div>

            <h2>No Invoices Yet</h2>

            <p>Your invoices will appear here after orders are invoiced.</p>
          </div>
        ) : (
          <div className="ss-invoice-list">
            {invoices.map((invoice) => (
              <div className="ss-invoice-card" key={invoice._id}>
                <div className="ss-invoice-card-header">
                  <div>
                    <span className="ss-invoice-label">INVOICE</span>

                    <h2>{invoice.invoiceNumber}</h2>

                    <p>
                      {invoice.issuedAt
                        ? new Date(invoice.issuedAt).toLocaleString("en-GB")
                        : "N/A"}
                    </p>
                  </div>

                  <span className="ss-invoice-status">{invoice.status}</span>
                </div>

                <div className="ss-invoice-details">
                  <div>
                    <span>Order</span>

                    <strong>
                      {invoice.order?._id || invoice.order || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>Subtotal</span>

                    <strong>
                      ৳ {Number(invoice.subtotal || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Charge</span>

                    <strong>
                      ৳ {Number(invoice.deliveryCharge || 0).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Total Amount</span>

                    <strong className="ss-invoice-total">
                      ৳ {Number(invoice.totalAmount || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="ss-invoice-footer">
                  <div>
                    <span>Created At</span>

                    <strong>
                      {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "N/A"}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="ss-invoice-view-btn"
                    onClick={() => openInvoice(invoice)}
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="invoice-modal-overlay" onClick={closeInvoice}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <div>
                <span>MeatLink</span>

                <h2>INVOICE</h2>
              </div>

              <button
                type="button"
                className="invoice-close-btn"
                onClick={closeInvoice}
              >
                ×
              </button>
            </div>

            <div className="invoice-main">
              <div className="invoice-business">
                <strong>MeatLink</strong>

                <span>Smart Meat Supply Chain</span>
              </div>

              <div className="invoice-number">
                <span>Invoice Number</span>

                <strong>{selectedInvoice.invoiceNumber}</strong>
              </div>
            </div>

            <div className="invoice-meta">
              <div>
                <span>Order ID</span>

                <strong>
                  {selectedInvoice.order?._id || selectedInvoice.order || "N/A"}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong className="invoice-issued">
                  {selectedInvoice.status}
                </strong>
              </div>

              <div>
                <span>Issued At</span>

                <strong>
                  {selectedInvoice.issuedAt
                    ? new Date(selectedInvoice.issuedAt).toLocaleString("en-GB")
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="invoice-table">
              <div className="invoice-table-row invoice-table-head">
                <span>Description</span>
                <span>Amount</span>
              </div>

              <div className="invoice-table-row">
                <span>Meat Order Subtotal</span>

                <strong>
                  ৳ {Number(selectedInvoice.subtotal || 0).toLocaleString()}
                </strong>
              </div>

              <div className="invoice-table-row">
                <span>Delivery Charge</span>

                <strong>
                  ৳{" "}
                  {Number(selectedInvoice.deliveryCharge || 0).toLocaleString()}
                </strong>
              </div>

              <div className="invoice-total-row">
                <span>Total Amount</span>

                <strong>
                  ৳ {Number(selectedInvoice.totalAmount || 0).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="invoice-modal-footer">
              <span>Thank you for using MeatLink.</span>

              <div>
                <button
                  type="button"
                  className="invoice-secondary-btn"
                  onClick={closeInvoice}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="invoice-print-btn"
                  onClick={printInvoice}
                >
                  🖨 Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperShopInvoices;
