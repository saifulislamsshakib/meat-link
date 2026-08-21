import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminComplaints.css";

function AdminComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [search, setSearch] = useState("");

  const [updating, setUpdating] = useState(null);

  const [responseMap, setResponseMap] = useState({});

  const loadComplaints = async () => {
    try {
      setError("");

      const response = await api.get("/complaints");

      setComplaints(response.data.complaints || []);

      const initialResponses = {};

      (response.data.complaints || []).forEach((complaint) => {
        initialResponses[complaint._id] = complaint.adminResponse || "";
      });

      setResponseMap(initialResponses);
    } catch (error) {
      console.error("Failed to load complaints:", error);

      setError(error.response?.data?.message || "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_progress":
        return "In Progress";

      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
    }
  };

  const getStatusClass = (status) => {
    return `admin-complaint-status ${status || ""}`;
  };

  const handleResponseChange = (complaintId, value) => {
    setResponseMap((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      setUpdating(complaintId);
      setError("");
      setSuccess("");

      const response = await api.patch(`/complaints/${complaintId}/status`, {
        status,
        adminResponse: responseMap[complaintId] || "",
      });

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId ? response.data.complaint : complaint,
        ),
      );

      setSuccess(response.data.message || "Complaint updated successfully.");
    } catch (error) {
      console.error("Failed to update complaint:", error);

      setError(error.response?.data?.message || "Failed to update complaint.");
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: complaints.length,

    pending: complaints.filter((item) => item.status === "pending").length,

    in_progress: complaints.filter((item) => item.status === "in_progress")
      .length,

    resolved: complaints.filter((item) => item.status === "resolved").length,

    rejected: complaints.filter((item) => item.status === "rejected").length,
  };

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;

      const complainantName = `${complaint.complainant?.firstName || ""} ${
        complaint.complainant?.lastName || ""
      }`.toLowerCase();

      const complainantEmail = (
        complaint.complainant?.email || ""
      ).toLowerCase();

      const subject = (complaint.subject || "").toLowerCase();

      const message = (complaint.message || "").toLowerCase();

      const matchesSearch =
        !query ||
        subject.includes(query) ||
        message.includes(query) ||
        complainantName.includes(query) ||
        complainantEmail.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, search]);

  if (loading) {
    return (
      <div className="admin-complaints-loading">Loading complaints...</div>
    );
  }

  return (
    <div className="admin-complaints-page">
      <div className="admin-complaints-container">
        {/* Header */}
        <div className="admin-complaints-header">
          <div>
            <span>Administration</span>

            <h1>Complaint Management</h1>

            <p>Review complaints and manage their resolution status.</p>
          </div>

          <button
            type="button"
            className="admin-complaints-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-complaints-error">{error}</div>}

        {success && <div className="admin-complaints-success">{success}</div>}

        {/* Summary */}
        <div className="admin-complaints-summary">
          {[
            ["all", "Total"],
            ["pending", "Pending"],
            ["in_progress", "In Progress"],
            ["resolved", "Resolved"],
            ["rejected", "Rejected"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={`admin-complaint-summary-card ${
                statusFilter === key ? "active" : ""
              }`}
              onClick={() => setStatusFilter(key)}
            >
              <span>{label}</span>

              <strong>{counts[key]}</strong>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="admin-complaints-filters">
          <input
            type="text"
            placeholder="Search by subject, user or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="in_progress">In Progress</option>

            <option value="resolved">Resolved</option>

            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="admin-complaints-empty">
            <div>⚠</div>

            <h2>No Complaints Found</h2>

            <p>No complaints match your current search or status filter.</p>
          </div>
        ) : (
          <div className="admin-complaints-list">
            {filteredComplaints.map((complaint) => {
              const complainant = complaint.complainant;

              const order = complaint.relatedOrder;

              return (
                <div className="admin-complaint-card" key={complaint._id}>
                  <div className="admin-complaint-card-header">
                    <div>
                      <span className="admin-complaint-label">COMPLAINT</span>

                      <h2>{complaint.subject}</h2>

                      <p>
                        Submitted on{" "}
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString(
                              "en-GB",
                            )
                          : "N/A"}
                      </p>
                    </div>

                    <span className={getStatusClass(complaint.status)}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>

                  <div className="admin-complaint-grid">
                    <div>
                      <span>Complainant</span>

                      <strong>
                        {complainant
                          ? `${complainant.firstName || ""} ${
                              complainant.lastName || ""
                            }`
                          : "N/A"}
                      </strong>

                      <small>{complainant?.email || ""}</small>
                    </div>

                    <div>
                      <span>Role</span>

                      <strong>
                        {complainant?.role
                          ? complainant.role === "super_shop"
                            ? "Super Shop"
                            : complainant.role.charAt(0).toUpperCase() +
                              complainant.role.slice(1)
                          : "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>Related Order</span>

                      <strong>{order?._id || "No related order"}</strong>

                      {order && (
                        <small>
                          {order.quantity} kg
                          {" · "}৳{" "}
                          {Number(order.totalPrice || 0).toLocaleString()}
                        </small>
                      )}
                    </div>

                    <div>
                      <span>Order Status</span>

                      <strong>
                        {order?.status ? getStatusLabel(order.status) : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-complaint-message">
                    <span>Complaint Message</span>

                    <p>{complaint.message}</p>
                  </div>

                  <div className="admin-complaint-response">
                    <label>Admin Response</label>

                    <textarea
                      rows="4"
                      value={responseMap[complaint._id] || ""}
                      onChange={(e) =>
                        handleResponseChange(complaint._id, e.target.value)
                      }
                      placeholder="Write a response to the complainant..."
                    />
                  </div>

                  <div className="admin-complaint-actions">
                    <button
                      type="button"
                      className="complaint-progress-btn"
                      disabled={updating === complaint._id}
                      onClick={() =>
                        handleStatusUpdate(complaint._id, "in_progress")
                      }
                    >
                      {updating === complaint._id
                        ? "Updating..."
                        : "In Progress"}
                    </button>

                    <button
                      type="button"
                      className="complaint-resolve-btn"
                      disabled={updating === complaint._id}
                      onClick={() =>
                        handleStatusUpdate(complaint._id, "resolved")
                      }
                    >
                      {updating === complaint._id ? "Updating..." : "Resolve"}
                    </button>

                    <button
                      type="button"
                      className="complaint-reject-btn"
                      disabled={updating === complaint._id}
                      onClick={() =>
                        handleStatusUpdate(complaint._id, "rejected")
                      }
                    >
                      {updating === complaint._id ? "Updating..." : "Reject"}
                    </button>
                  </div>

                  {complaint.adminResponse && (
                    <div className="admin-complaint-existing-response">
                      <span>Previous Admin Response</span>

                      <p>{complaint.adminResponse}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;
