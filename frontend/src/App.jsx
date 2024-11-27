import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Customer from "./pages/Customer";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import { BreadcrumbThree } from "./pages/BreadcrumbThree";
import EnterOpt from "./pages/EnterOpt";
import SetPassword from "./pages/SetPassword";
import EnterOtpCustomer from "./pages/EnterOtpCustomer";
import SetPasswordEmployee from "./pages/SetPasswordEmployee";
import ForgotPassword from "./components/ForgotPassword";

// Component for protected routes
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar role={userRole} style={{ flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
          <BreadcrumbThree />
        </div>
        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired,
};

// Component for public routes
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If user is logged in, redirect to a different page based on their role
  if (token) {
    const userRole = localStorage.getItem("role");
    if (userRole === "admin") {
      return <Navigate to="/admin" />;
    }
    if (userRole === "employee") {
      return <Navigate to="/employee" />;
    }
    if (userRole === "customer") {
      return <Navigate to="/customer" />;
    }
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute role="employee">
              <Employee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute role="customer">
              <Customer />
            </ProtectedRoute>
          }
        />
        <Route path="/EnterOtp" element={<EnterOpt />} />
        <Route path="/EnterOtpCustomer" element={<EnterOtpCustomer />} />

        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        <Route path="/SetPassword" element={<SetPassword />} />
        <Route path="/SetPasswordCustomer" element={<SetPasswordEmployee />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
