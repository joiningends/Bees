import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  const fetchNotifications = async () => {
    try {
      let response;
      const now = new Date();
      const sevenDaysAgo = new Date(
        now.setDate(now.getDate() - 7)
      ).toISOString();

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
        // Filter notifications to include only those from the last 7 days
        const filteredNotifications = data.filter(
          notification =>
            new Date(notification.startdate) >= new Date(sevenDaysAgo)
        );
        setNotifications(filteredNotifications);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#434a8c] mb-6">
          Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications in the past 7 days.</p>
        ) : (
          <div className="space-y-4">
            {notifications
              .slice() // Create a shallow copy of the notifications array
              .reverse() // Reverse the copy
              .map((notification, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-lg bg-[#ffffff] shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#434a8c]"></div>
                    <span className="text-sm font-medium text-[#434a8c]">
                      {userRole === "admin"
                        ? ` A new ticket ${notification.ticketNumber} has been created
                      by ${notification.assignToEmployeeId?.name}.`
                        : ` A new ticket ${notification.ticketNumber} has been assigned
                to you.`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.startdate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }
                    )}{" "}
                    {new Date(notification.startdate).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
              ))}
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-[#434a8c] text-white rounded-lg hover:bg-[#3a438b] focus:outline-none focus:ring-2 focus:ring-[#434a8c] focus:ring-opacity-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
