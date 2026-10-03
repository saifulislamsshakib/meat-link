import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthenticatedNavbar.css";

function AuthenticatedNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case "farmer":
        return "/farmer/dashboard";

      case "slaughterhouse":
        return "/slaughterhouse/dashboard";

      case "super_shop":
        return "/super-shop/dashboard";

      case "driver":
        return "/driver/dashboard";

      case "admin":
        return "/admin/dashboard";

      default:
        return "/";
    }
  };

  const getNotificationPath = () => {
    switch (user?.role) {
      case "farmer":
        return "/farmer/notifications";

      case "slaughterhouse":
        return "/slaughterhouse/notifications";

      case "super_shop":
        return "/super-shop/notifications";

      case "driver":
        return "/driver/notifications";

      default:
        return "/";
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
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

  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        {/* Brand */}
        <button
          type="button"
          className="auth-brand"
          onClick={() => navigate(getDashboardPath())}
        >
          <span className="auth-brand-icon">🥩</span>

          <span>MeatLink</span>
        </button>

        {/* Right */}
        <div className="auth-navbar-right">
          {/* Dashboard */}
          <button
            type="button"
            className="auth-dashboard-btn"
            onClick={() => navigate(getDashboardPath())}
          >
            Dashboard
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="notification-btn"
            onClick={() => navigate(getNotificationPath())}
            title="Notifications"
          >
            🔔
          </button>

          {/* User */}
          <div className="auth-user">
            <div className="auth-user-avatar">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="auth-user-info">
              <strong>
                {user?.firstName || ""} {user?.lastName || ""}
              </strong>

              <span>{getRoleLabel()}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="auth-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AuthenticatedNavbar;
