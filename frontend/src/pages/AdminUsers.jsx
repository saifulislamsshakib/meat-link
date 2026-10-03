import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUserStatus = async (userId, action) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");

      const endpoint =
        action === "approve"
          ? `/admin/users/${userId}/approve`
          : `/admin/users/${userId}/reject`;

      const response = await api.patch(endpoint);

      setUsers((prev) =>
        prev.map((item) =>
          item._id === userId
            ? {
                ...item,
                accountStatus:
                  response.data.user?.accountStatus ||
                  (action === "approve" ? "approved" : "rejected"),
              }
            : item,
        ),
      );

      setSuccess(response.data.message || `User ${action}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);

      setError(error.response?.data?.message || `Failed to ${action} user.`);
    } finally {
      setActionLoading(null);
    }
  };

  const getAccountStatus = (user) => {
    if (user.role === "admin") {
      return "approved";
    }

    return user.accountStatus || "pending";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";

      case "rejected":
        return "Rejected";

      default:
        return "Pending";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "super_shop":
        return "Super Shop";

      case "slaughterhouse":
        return "Slaughterhouse";

      case "farmer":
        return "Farmer";

      case "driver":
        return "Driver";

      case "admin":
        return "Admin";

      default:
        return "User";
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const accountStatus = getAccountStatus(user);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" || accountStatus === statusFilter;

      const fullName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.toLowerCase();

      const email = (user.email || "").toLowerCase();

      const matchesSearch =
        !query || fullName.includes(query) || email.includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, roleFilter, statusFilter, search]);

  const pendingCount = users.filter(
    (user) => getAccountStatus(user) === "pending",
  ).length;

  const approvedCount = users.filter(
    (user) => getAccountStatus(user) === "approved",
  ).length;

  const rejectedCount = users.filter(
    (user) => getAccountStatus(user) === "rejected",
  ).length;

  if (loading) {
    return <div className="admin-users-loading">Loading users...</div>;
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">
        {/* Header */}
        <div className="admin-users-header">
          <div>
            <span>Administration</span>

            <h1>User Management</h1>

            <p>Review registrations and approve or reject user accounts.</p>
          </div>

          <button
            type="button"
            className="admin-users-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {error && <div className="admin-users-error">{error}</div>}

        {success && <div className="admin-users-success">{success}</div>}

        {/* Summary */}
        <div className="admin-users-summary">
          <button
            type="button"
            className={`admin-user-summary-card ${
              statusFilter === "all" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </button>

          <button
            type="button"
            className={`admin-user-summary-card pending-card ${
              statusFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </button>

          <button
            type="button"
            className={`admin-user-summary-card approved-card ${
              statusFilter === "approved" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("approved")}
          >
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </button>

          <button
            type="button"
            className={`admin-user-summary-card rejected-card ${
              statusFilter === "rejected" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("rejected")}
          >
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </button>
        </div>

        {/* Filters */}
        <div className="admin-users-filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>

            <option value="farmer">Farmer</option>

            <option value="slaughterhouse">Slaughterhouse</option>

            <option value="super_shop">Super Shop</option>

            <option value="driver">Driver</option>

            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>

            <option value="pending">Pending</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* User List */}
        {filteredUsers.length === 0 ? (
          <div className="admin-users-empty">
            <div>👥</div>

            <h2>No Users Found</h2>

            <p>No users match your current search or filters.</p>
          </div>
        ) : (
          <div className="admin-users-card">
            <div className="admin-users-table-header">
              <span>USER</span>
              <span>EMAIL</span>
              <span>ROLE</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            <div className="admin-users-table">
              {filteredUsers.map((user) => {
                const accountStatus = getAccountStatus(user);

                return (
                  <div className="admin-user-row" key={user._id}>
                    <div className="admin-user-cell user-main">
                      <div className="admin-user-avatar">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <strong>
                          {user.firstName || ""} {user.lastName || ""}
                        </strong>

                        <small>{user.phoneNo || "No phone"}</small>
                      </div>
                    </div>

                    <div className="admin-user-cell">
                      <span>{user.email || "N/A"}</span>
                    </div>

                    <div className="admin-user-cell">
                      <span className={`admin-role-badge ${user.role}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>

                    {/* Account Status */}
                    <div className="admin-user-cell">
                      <span className={`admin-user-status ${accountStatus}`}>
                        {getStatusLabel(accountStatus)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="admin-user-cell action-cell">
                      {user.role === "admin" ? (
                        <span className="admin-no-action">Admin</span>
                      ) : accountStatus === "pending" ? (
                        <div className="admin-user-actions">
                          <button
                            type="button"
                            className="admin-approve-btn"
                            disabled={actionLoading === user._id}
                            onClick={() =>
                              updateUserStatus(user._id, "approve")
                            }
                          >
                            {actionLoading === user._id ? "..." : "Approve"}
                          </button>

                          <button
                            type="button"
                            className="admin-reject-btn"
                            disabled={actionLoading === user._id}
                            onClick={() => updateUserStatus(user._id, "reject")}
                          >
                            {actionLoading === user._id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="admin-no-action">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
