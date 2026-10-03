// import { Routes, Route } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// import Navbar from "./components/Navbar";
// import AuthenticatedNavbar from "./components/AuthenticatedNavbar";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Login from "./pages/Login";

// /* Farmer */
// import FarmerDashboard from "./pages/FarmerDashboard";
// import AddLivestock from "./pages/AddLivestock";
// import FarmerRequests from "./pages/FarmerRequests";
// import FarmerNotifications from "./pages/FarmerNotifications";
// import FarmerTransactions from "./pages/FarmerTransactions";

// /* Slaughterhouse */
// import SlaughterhouseDashboard from "./pages/SlaughterhouseDashboard";
// import SlaughterhouseOrders from "./pages/SlaughterhouseOrders";
// import SlaughterhouseProcurement from "./pages/SlaughterhouseProcurement";
// import SlaughterhouseProcurementRequests from "./pages/SlaughterhouseProcurementRequests";
// import SlaughterhouseMeatProducts from "./pages/SlaughterhouseMeatProducts";
// import SlaughterhouseProductManagement from "./pages/SlaughterhouseProductManagement";
// import SlaughterhouseDeliveries from "./pages/SlaughterhouseDeliveries";

// /* Super Shop */
// import SuperShopDashboard from "./pages/SuperShopDashboard";
// import SuperShopProducts from "./pages/SuperShopProducts";
// import SuperShopOrders from "./pages/SuperShopOrders";
// import SuperShopNotifications from "./pages/SuperShopNotifications";
// import SuperShopInvoices from "./pages/SuperShopInvoices";

// /* Driver */
// import DriverDashboard from "./pages/DriverDashboard";

// /* Admin */
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminUsers from "./pages/AdminUsers";
// import AdminOrders from "./pages/AdminOrders";
// import AdminDeliveries from "./pages/AdminDeliveries";
// import AdminReports from "./pages/AdminReports";
// import AdminComplaints from "./pages/AdminComplaints";
// import Register from "./pages/Register";
// import VerifyEmail from "./pages/VerifyEmail";
// import FarmerLivestock from "./pages/FarmerLivestock";
// import EditLivestock from "./pages/EditLivestock";
// import UserComplaints from "./pages/UserComplaints";

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <>
//       {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}

//       <Routes>
//         {/* =========================
//             Public Routes
//         ========================= */}

//         <Route path="/" element={<Login />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify/:token" element={<VerifyEmail />} />

//         {/* =========================
//             Farmer Routes
//         ========================= */}

//         <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
//           <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
//           <Route path="/farmer/livestock" element={<FarmerLivestock />} />

//           <Route path="/farmer/livestock/add" element={<AddLivestock />} />
//           <Route
//             path="/farmer/livestock/edit/:id"
//             element={<EditLivestock />}
//           />

//           <Route path="/farmer/requests" element={<FarmerRequests />} />

//           <Route
//             path="/farmer/notifications"
//             element={<FarmerNotifications />}
//           />

//           <Route path="/farmer/transactions" element={<FarmerTransactions />} />
//           <Route path="/complaints" element={<UserComplaints />} />
//         </Route>

//         {/* =========================
//             Slaughterhouse Routes
//         ========================= */}

//         <Route element={<ProtectedRoute allowedRoles={["slaughterhouse"]} />}>
//           <Route
//             path="/slaughterhouse/dashboard"
//             element={<SlaughterhouseDashboard />}
//           />

//           <Route
//             path="/slaughterhouse/orders"
//             element={<SlaughterhouseOrders />}
//           />

//           <Route
//             path="/slaughterhouse/procurement"
//             element={<SlaughterhouseProcurement />}
//           />

//           <Route
//             path="/slaughterhouse/procurement-requests"
//             element={<SlaughterhouseProcurementRequests />}
//           />

//           <Route
//             path="/slaughterhouse/products"
//             element={<SlaughterhouseMeatProducts />}
//           />

//           <Route
//             path="/slaughterhouse/product-management"
//             element={<SlaughterhouseProductManagement />}
//           />

//           <Route
//             path="/slaughterhouse/deliveries"
//             element={<SlaughterhouseDeliveries />}
//           />
//           <Route path="/complaints" element={<UserComplaints />} />
//         </Route>

//         {/* =========================
//             Super Shop Routes
//         ========================= */}

//         <Route element={<ProtectedRoute allowedRoles={["super_shop"]} />}>
//           <Route
//             path="/super-shop/dashboard"
//             element={<SuperShopDashboard />}
//           />

//           <Route path="/super-shop/products" element={<SuperShopProducts />} />

//           <Route path="/super-shop/orders" element={<SuperShopOrders />} />

//           <Route
//             path="/super-shop/notifications"
//             element={<SuperShopNotifications />}
//           />

//           <Route path="/super-shop/invoices" element={<SuperShopInvoices />} />
//           <Route path="/complaints" element={<UserComplaints />} />
//         </Route>

//         {/* =========================
//             Driver Routes
//         ========================= */}

//         <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
//           <Route path="/driver/dashboard" element={<DriverDashboard />} />
//           <Route path="/complaints" element={<UserComplaints />} />
//         </Route>

//         {/* =========================
//             Admin Routes
//         ========================= */}

//         <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/users" element={<AdminUsers />} />
//           <Route path="/admin/orders" element={<AdminOrders />} />
//           <Route path="/admin/deliveries" element={<AdminDeliveries />} />
//           <Route path="/admin/reports" element={<AdminReports />} />
//           <Route path="/admin/complaints" element={<AdminComplaints />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import AuthenticatedNavbar from "./components/AuthenticatedNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

/* Farmer */
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerLivestock from "./pages/FarmerLivestock";
import AddLivestock from "./pages/AddLivestock";
import EditLivestock from "./pages/EditLivestock";
import FarmerRequests from "./pages/FarmerRequests";
import FarmerNotifications from "./pages/FarmerNotifications";
import FarmerTransactions from "./pages/FarmerTransactions";

/* Slaughterhouse */
import SlaughterhouseDashboard from "./pages/SlaughterhouseDashboard";
import SlaughterhouseOrders from "./pages/SlaughterhouseOrders";
import SlaughterhouseProcurement from "./pages/SlaughterhouseProcurement";
import SlaughterhouseProcurementRequests from "./pages/SlaughterhouseProcurementRequests";
import SlaughterhouseMeatProducts from "./pages/SlaughterhouseMeatProducts";
import SlaughterhouseProductManagement from "./pages/SlaughterhouseProductManagement";
import SlaughterhouseDeliveries from "./pages/SlaughterhouseDeliveries";

/* Super Shop */
import SuperShopDashboard from "./pages/SuperShopDashboard";
import SuperShopProducts from "./pages/SuperShopProducts";
import SuperShopOrders from "./pages/SuperShopOrders";
import SuperShopNotifications from "./pages/SuperShopNotifications";
import SuperShopInvoices from "./pages/SuperShopInvoices";

/* Driver */
import DriverDashboard from "./pages/DriverDashboard";

/* Admin */
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminReports from "./pages/AdminReports";
import AdminComplaints from "./pages/AdminComplaints";

/* Common */
import UserComplaints from "./pages/UserComplaints";
import SlaughterhouseRatings from "./pages/SlaughterhouseRatings";
import AdminRatings from "./pages/AdminRatings";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <AuthenticatedNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify/:token" element={<VerifyEmail />} />

        {/* Farmer Routes */}

        <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

          <Route path="/farmer/livestock" element={<FarmerLivestock />} />

          <Route path="/farmer/livestock/add" element={<AddLivestock />} />

          <Route
            path="/farmer/livestock/edit/:id"
            element={<EditLivestock />}
          />

          <Route path="/farmer/requests" element={<FarmerRequests />} />

          <Route
            path="/farmer/notifications"
            element={<FarmerNotifications />}
          />

          <Route path="/farmer/transactions" element={<FarmerTransactions />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["slaughterhouse"]} />}>
          <Route
            path="/slaughterhouse/dashboard"
            element={<SlaughterhouseDashboard />}
          />

          <Route
            path="/slaughterhouse/orders"
            element={<SlaughterhouseOrders />}
          />

          <Route
            path="/slaughterhouse/procurement"
            element={<SlaughterhouseProcurement />}
          />

          <Route
            path="/slaughterhouse/procurement-requests"
            element={<SlaughterhouseProcurementRequests />}
          />

          <Route
            path="/slaughterhouse/products"
            element={<SlaughterhouseMeatProducts />}
          />

          <Route
            path="/slaughterhouse/product-management"
            element={<SlaughterhouseProductManagement />}
          />

          <Route
            path="/slaughterhouse/deliveries"
            element={<SlaughterhouseDeliveries />}
          />
          <Route
            path="/slaughterhouse/ratings"
            element={<SlaughterhouseRatings />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["super_shop"]} />}>
          <Route
            path="/super-shop/dashboard"
            element={<SuperShopDashboard />}
          />

          <Route path="/super-shop/products" element={<SuperShopProducts />} />

          <Route path="/super-shop/orders" element={<SuperShopOrders />} />

          <Route
            path="/super-shop/notifications"
            element={<SuperShopNotifications />}
          />

          <Route path="/super-shop/invoices" element={<SuperShopInvoices />} />
        </Route>

        {/* Driver Routes */}

        <Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
        </Route>

        {/* Common User Complaint */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "farmer",
                "slaughterhouse",
                "super_shop",
                "driver",
              ]}
            />
          }
        >
          <Route path="/complaints" element={<UserComplaints />} />
        </Route>

        {/* =========================
            Admin Routes
        ========================= */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/orders" element={<AdminOrders />} />

          <Route path="/admin/deliveries" element={<AdminDeliveries />} />

          <Route path="/admin/reports" element={<AdminReports />} />

          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
