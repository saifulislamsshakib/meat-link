import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminReports.css";

function AdminReports() {
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setError("");

        const response = await api.get("/admin/reports");

        setReport(response.data.report || null);
      } catch (error) {
        console.error("Failed to load admin report:", error);

        setError(error.response?.data?.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return <div className="admin-reports-loading">Loading reports...</div>;
  }

  if (!report) {
    return (
      <div className="admin-reports-page">
        <div className="admin-reports-container">
          <div className="admin-reports-error">
            {error || "No report data available."}
          </div>
        </div>
      </div>
    );
  }

  const { orders, sales, deliveries, users, complaints } = report;

  const deliveryRate =
    deliveries.total > 0
      ? Math.round((deliveries.delivered / deliveries.total) * 100)
      : 0;

  const complaintResolutionRate =
    complaints.total > 0
      ? Math.round((complaints.resolved / complaints.total) * 100)
      : 0;

  const orderCompletionRate =
    orders.total > 0 ? Math.round((orders.delivered / orders.total) * 100) : 0;

  return (
    <div className="admin-reports-page">
      <div className="admin-reports-container">
        {/* Header */}
        <div className="admin-reports-header">
          <div>
            <span>Administration</span>

            <h1>Reports & Analytics</h1>

            <p>
              Monitor platform performance, sales, deliveries and customer
              support.
            </p>
          </div>

          <button
            type="button"
            className="admin-reports-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-reports-error">{error}</div>}

        {/* Sales Overview */}
        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>Sales Overview</h2>
              <p>Revenue generated from delivered orders.</p>
            </div>
          </div>

          <div className="admin-report-main-card">
            <div>
              <span>Total Sales</span>

              <strong>৳ {Number(sales.total || 0).toLocaleString()}</strong>
            </div>

            <div className="admin-report-highlight">
              <span>Completed Orders</span>

              <strong>{orders.delivered}</strong>
            </div>
          </div>
        </section>

        {/* Order Report */}
        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>Order Report</h2>
              <p>Overall order performance.</p>
            </div>
          </div>

          <div className="admin-report-grid">
            <div className="admin-report-card">
              <span>Total Orders</span>

              <strong>{orders.total}</strong>
            </div>

            <div className="admin-report-card">
              <span>Pending Orders</span>

              <strong className="warning">{orders.pending}</strong>
            </div>

            <div className="admin-report-card">
              <span>Delivered Orders</span>

              <strong className="green">{orders.delivered}</strong>
            </div>

            <div className="admin-report-card">
              <span>Completion Rate</span>

              <strong>{orderCompletionRate}%</strong>
            </div>
          </div>
        </section>

        {/* Delivery Report */}
        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>Delivery Report</h2>

              <p>Driver delivery performance.</p>
            </div>
          </div>

          <div className="admin-report-grid">
            <div className="admin-report-card">
              <span>Total Deliveries</span>

              <strong>{deliveries.total}</strong>
            </div>

            <div className="admin-report-card">
              <span>Delivered</span>

              <strong className="green">{deliveries.delivered}</strong>
            </div>

            <div className="admin-report-card">
              <span>Delivery Rate</span>

              <strong>{deliveryRate}%</strong>
            </div>
          </div>

          <div className="admin-progress-card">
            <div className="admin-progress-header">
              <span>Delivery Completion</span>

              <strong>{deliveryRate}%</strong>
            </div>

            <div className="admin-progress-track">
              <div
                className="admin-progress-fill delivery"
                style={{
                  width: `${deliveryRate}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* User Report */}
        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>User Report</h2>

              <p>Total registered users on the platform.</p>
            </div>
          </div>

          <div className="admin-report-main-card">
            <div>
              <span>Total Users</span>

              <strong>{users.total}</strong>
            </div>

            <div className="admin-report-highlight">
              <span>Average Orders / User</span>

              <strong>
                {users.total > 0
                  ? (orders.total / users.total).toFixed(1)
                  : "0.0"}
              </strong>
            </div>
          </div>
        </section>

        {/* Complaint Report */}
        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>Complaint Report</h2>

              <p>Customer complaints and resolution performance.</p>
            </div>

            <button
              type="button"
              className="admin-report-action-btn"
              onClick={() => navigate("/admin/complaints")}
            >
              Manage Complaints
            </button>
          </div>

          <div className="admin-report-grid">
            <div className="admin-report-card">
              <span>Total Complaints</span>

              <strong>{complaints.total}</strong>
            </div>

            <div className="admin-report-card">
              <span>Resolved</span>

              <strong className="green">{complaints.resolved}</strong>
            </div>

            <div className="admin-report-card">
              <span>Resolution Rate</span>

              <strong>{complaintResolutionRate}%</strong>
            </div>
          </div>

          <div className="admin-progress-card">
            <div className="admin-progress-header">
              <span>Complaint Resolution</span>

              <strong>{complaintResolutionRate}%</strong>
            </div>

            <div className="admin-progress-track">
              <div
                className="admin-progress-fill complaints"
                style={{
                  width: `${complaintResolutionRate}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="admin-report-section">
          <div className="admin-report-section-header">
            <div>
              <h2>Management Pages</h2>

              <p>Quick access to admin modules.</p>
            </div>
          </div>

          <div className="admin-report-actions">
            <button type="button" onClick={() => navigate("/admin/users")}>
              👥 Users
            </button>

            <button type="button" onClick={() => navigate("/admin/orders")}>
              🛒 Orders
            </button>

            <button type="button" onClick={() => navigate("/admin/deliveries")}>
              🚚 Deliveries
            </button>

            <button type="button" onClick={() => navigate("/admin/complaints")}>
              ⚠ Complaints
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminReports;
