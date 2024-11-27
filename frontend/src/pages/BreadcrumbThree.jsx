import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export function BreadcrumbThree() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const pathnames = location.pathname.split("/").filter(x => x);

  // Remove the last element if it's an ID (assumed to be alphanumeric and a certain length)
  if (
    pathnames.length > 0 &&
    /^[a-f0-9]{24}$/i.test(pathnames[pathnames.length - 1])
  ) {
    pathnames.pop();
  }

  const userRole = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const fetchNotifications = async () => {
    try {
      let response;
      if (userRole === "admin") {
        response = await fetch(
          "https://crm.bees.in/api/v1/ticket/status/66bb11ee94edfa4612ffd150"
        );
      } else if (userRole === "employee") {
        response = await fetch(
          `https://crm.bees.in/api/v1/ticket/status/66bb11ee94edfa4612ffd150/${userId}`
        );
      }

      if (response.ok) {
        const data = await response.json();
        const latestNotifications = data.slice(0, 4); // Get the top 4 notifications
        setNotifications(latestNotifications.reverse()); // Reverse the notifications
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleClickOutside = event => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center">
      {/* Breadcrumb Navigation */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <li key={to} aria-current="page">
                <div className="flex items-center">
                  {index !== 0 && (
                    <span className="mx-2.5 text-[#434a8c]">/</span>
                  )}
                  <span className="ml-1 text-sm font-medium text-[#434a8c]">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                </div>
              </li>
            ) : (
              <li key={to}>
                <div className="flex items-center">
                  {index !== 0 && (
                    <span className="mx-2.5 text-[#434a8c]">/</span>
                  )}
                  <Link
                    to={to}
                    className="ml-1 text-sm font-medium text-[#434a8c] hover:underline"
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Notification Bell */}
      <div className="relative">
        <div
          className="relative cursor-pointer"
          onClick={() => {
            fetchNotifications();
            setShowNotifications(prev => !prev);
          }}
        >
          <FontAwesomeIcon icon={faBell} className="text-[#434a8c]" />
          {/* Always show the red dot on the bell icon */}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></span>
        </div>

        {showNotifications && notifications.length > 0 && (
          <div
            ref={notificationRef}
            className="absolute top-8 right-0 mt-1 w-64 p-2 bg-white border border-gray-300 rounded shadow-lg text-sm z-10"
          >
            {notifications.map((notification, index) => (
              <div key={index} className="mb-2 last:mb-0">
                {userRole === "admin" ? (
                  <p>
                    A new ticket {notification.ticketNumber} has been created by{" "}
                    {notification.assignToEmployeeId?.name}.
                  </p>
                ) : (
                  <p>
                    A new ticket {notification.ticketNumber} has been assigned
                    to you.
                  </p>
                )}
              </div>
            ))}
            {/* See More Button */}
            <button
              onClick={() => {
                const route =
                  userRole === "admin"
                    ? "/admin/Notifications"
                    : "/employee/Notifications";
                navigate(route);
              }}
              className="mt-2 w-full text-sm text-center text-blue-600 hover:underline"
            >
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
