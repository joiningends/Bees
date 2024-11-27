import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTachometerAlt,
  faUsers,
  faTicketAlt,
  faUserCircle,
  faClipboardList,
  faFolderOpen,
  faChartLine,
  faFileAlt,
  faFileInvoice,
  faWrench,
  faSignOutAlt,
  faCaretDown,
  faEnvelope,
  faBirthdayCake,
  faCogs,
  faTrashAlt,
  faTags, 
} from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./SideBar.css";

import logo from "../../../frontend/logoOf.png";

const routes = {
  admin: [
    { path: "/admin/", label: "Dashboard", icon: faTachometerAlt },
    { path: "/admin/Employee", label: "Employee", icon: faUsers },
    { path: "/admin/Customer", label: "Customer", icon: faUserCircle },
    { path: "/admin/ticket", label: "Ticket", icon: faTicketAlt },
    {
      path: "/admin/ticket/ViewEditTickets",
      label: "View/Edit Tickets",
      icon: faFolderOpen,
    },
    {
      label: "Reports",
      icon: faFileAlt,
      subMenu: [
        {
          path: "/admin/CustomerReport",
          label: "Customer Report",
          icon: faFileAlt,
        },
        {
          path: "/admin/EmployeeReport",
          label: "Employee Report",
          icon: faFileInvoice,
        },
        {
          path: "/admin/TicketTypeReport",
          label: "Ticket Type Report",
          icon: faChartLine,
        },
        {
          path: "/admin/DeleteReport",
          label: "Delete Ticket Report",
          icon: faTrashAlt,
        },
        {
          path: "/admin/BirthdayReport",
          label: "Birthday Report",
          icon: faTrashAlt,
        },
      ],
    },
    {
      label: "Setting",
      icon: faCogs,
      subMenu: [
        {
          path: "/admin/settings",
          label: "General Setting",
          icon: faWrench,
        },
        {
          path: "/admin/BulkEmail",
          label: "Bulk Email",
          icon: faEnvelope,
        },
        {
          path: "/admin/BirthdayMesage",
          label: "Birthday Messages",
          icon: faBirthdayCake,
        },
        {
          path: "/admin/Tags",
          label: "Tags",
          icon: faTags, // Tags icon to represent label/tagging functionality
        },
        {
          path: "/admin/Groups",
          label: "Groups",
          icon: faUsers, // Users icon representing group management
        },
      ],
    },
  ],
  employee: [
    { path: "/Employee/", label: "Dashboard", icon: faTachometerAlt },
    { path: "/Employee/Ticket", label: "Ticket", icon: faClipboardList },
    { path: "/Employee/Open", label: "View/Edit Tickets", icon: faFolderOpen },
    {
      label: "Setting",
      icon: faCogs,
      subMenu: [
        {
          path: "/Employee/BulkEmail",
          label: "Bulk Email",
          icon: faEnvelope,
        },
      ],
    },
  ],
  customer: [
    { path: "/Customer/", label: "Dashboard", icon: faTachometerAlt },
    { path: "/Customer/Ticket", label: "Ticket", icon: faClipboardList },
  ],
};

const Sidebar = ({ role }) => {
  const roleRoutes = routes[role] || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  const filteredRoutes = roleRoutes.filter(route =>
    route.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("customerCode");
            navigate("/");
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleMenuClick = menu => {
    setExpandedMenu(menu === expandedMenu ? null : menu);
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F8FF",
        color: "#4b57ad",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: isCollapsed ? "80px" : "250px",
        transition: "width 0.3s",
        position: "relative",
        overflowY: "auto",
        minWidth: "12rem",
      }}
    >
      {/* Company Logo */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <img
          src={logo}
          alt="Company Logo"
          style={{
            width: isCollapsed ? "40px" : "80px",
            height: isCollapsed ? "40px" : "80px",
            objectFit: "contain",
            backgroundColor: "white",
            borderRadius: "20%",
            padding: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "width 0.3s, height 0.3s",
          }}
        />
      </div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: "absolute",
          top: "16px",
          right: isCollapsed ? "-10px" : "1px",
          backgroundColor: "#4b57ad",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          transition: "right 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
      {/* Search Bar */}
      {/* {!isCollapsed && (
        <div style={{ width: "100%", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#4b57ad",
              border: "1px solid #4b57ad",
              outline: "none",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      )} */}
      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {filteredRoutes.map(route => (
          <div key={route.label} style={{ width: "100%" }}>
            {route.subMenu ? (
              <>
                <a
                  onClick={() => handleMenuClick(route.label)}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#4b57ad",
                    color: "white",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "space-between",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#3a3d71";
                    e.target.style.color = "#d9d9d9";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "#4b57ad";
                    e.target.style.color = "white";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon={route.icon}
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: isCollapsed ? "0" : "12px",
                        color: "white",
                        transition: "margin-right 0.3s",
                      }}
                    />
                    {!isCollapsed && route.label}
                  </div>
                  {!isCollapsed && (
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      style={{
                        transition: "transform 0.3s",
                        transform:
                          expandedMenu === route.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    />
                  )}
                </a>
                {!isCollapsed &&
                  expandedMenu === route.label &&
                  route.subMenu.map(subRoute => (
                    <a
                      key={subRoute.path}
                      href={subRoute.path}
                      style={{
                        padding: "12px",
                        marginBottom: "8px",
                        borderRadius: "8px",
                        backgroundColor: "#4b57ad",
                        color: "white",
                        textAlign: "center",
                        textDecoration: "none",
                        transition: "background-color 0.2s, color 0.2s",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginLeft: "20px",
                        fontSize: "0.8rem",
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = "#3a3d71";
                        e.target.style.color = "#d9d9d9";
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = "#4b57ad";
                        e.target.style.color = "white";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={subRoute.icon}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "12px",
                          color: "white",
                        }}
                      />
                      {subRoute.label}
                    </a>
                  ))}
              </>
            ) : (
              <a
                href={route.path}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#4b57ad",
                  color: "white",
                  textAlign: "center",
                  textDecoration: "none",
                  transition: "background-color 0.2s, color 0.2s",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = "#3a3d71";
                  e.target.style.color = "#d9d9d9";
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = "#4b57ad";
                  e.target.style.color = "white";
                }}
              >
                <FontAwesomeIcon
                  icon={route.icon}
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: isCollapsed ? "0" : "12px",
                    color: "white",
                    transition: "margin-right 0.3s",
                  }}
                />
                {!isCollapsed && route.label}
              </a>
            )}
          </div>
        ))}
      </nav>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "auto",
          padding: "12px",
          borderRadius: "8px",
          backgroundColor: "#e5337f",
          color: "white",
          textAlign: "center",
          textDecoration: "none",
          transition: "background-color 0.2s, color 0.2s",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          width: "100%",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = "#c1266b"; // Darker shade on hover
          e.target.style.color = "#d9d9d9"; // Light color on hover
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = "#e5337f"; // Reset background color
          e.target.style.color = "white"; // Reset text color
        }}
      >
        <FontAwesomeIcon
          icon={faSignOutAlt}
          style={{
            width: "24px",
            height: "24px",
            marginRight: isCollapsed ? "0" : "12px",
            color: "white",
            transition: "margin-right 0.3s",
          }}
        />
        {!isCollapsed && "Logout"}
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.oneOf(["admin", "employee", "customer"]).isRequired,
};

export default Sidebar;
