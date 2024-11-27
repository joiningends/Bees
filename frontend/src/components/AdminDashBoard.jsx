import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

// Register the required ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashBoard() {
  const [data, setData] = useState(null);
  const [pieChartData, setPieChartData] = useState({});
  const [ticketStatuses, setTicketStatuses] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios
      .get("https://crm.bees.in/api/v1/users/dash/bord")
      .then((response) => {
        const { totalCustomers, totalEmployees, ticketsByStatus } =
          response.data;

        setTicketStatuses(ticketsByStatus);

        const pieData = {
          labels: ticketsByStatus.map((ticket) => ticket.status),
          datasets: [
            {
              data: ticketsByStatus.map((ticket) => ticket.count),
              backgroundColor: generateColors(ticketsByStatus.length),
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        };

        setPieChartData(pieData);
        setData({ totalCustomers, totalEmployees });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const generateColors = (length) => {
    const baseColors = ["#434a8c", "#4b57ad", "#e5337f"];
    const shades = baseColors.flatMap((color) => [
      color,
      lightenColor(color, 0.2),
      lightenColor(color, 0.4),
    ]);
    return shades.slice(0, length);
  };

  const lightenColor = (color, percent) => {
    const f = parseInt(color.slice(1), 16);
    const r = Math.min(255, (f >> 16) + percent * 255);
    const g = Math.min(255, ((f >> 8) & 0x00ff) + percent * 255);
    const b = Math.min(255, (f & 0x0000ff) + percent * 255);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const iconList = {
    Pending: PendingActionsIcon,
    Closed: DoneAllIcon,
    Open: PreviewIcon,
  };

  const getIcon = (status) => {
    return iconList[status] || HelpIcon;
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#333",
        padding: "30px",
        backgroundColor: "#f0f4f8",
      }}
    >
      <button
        onClick={() => navigate("/Admin/Ticket")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#4b57ad",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add Ticket
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ color: "#4b57ad", marginBottom: "20px", fontSize: "24px" }}
        >
          Number of Tickets
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {ticketStatuses.length > 0 &&
            ticketStatuses.map((ticket, index) => {
              const Icon = getIcon(ticket.status);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#e9f5ff",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    flex: "1 1 200px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <Icon
                    fontSize="large"
                    style={{ marginBottom: "10px", color: "#4b57ad" }}
                  />
                  <h3
                    style={{
                      color: "#4b57ad",
                      margin: "10px 0",
                      fontSize: "18px",
                    }}
                  >
                    {ticket.status}
                  </h3>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#e5337f",
                    }}
                  >
                    {ticket.count}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#e9f5ff",
              borderRadius: "12px",
              padding: "20px",
              flex: "1 1 45%",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <GroupIcon
              fontSize="large"
              style={{ marginBottom: "10px", color: "#4b57ad" }}
            />
            <h3
              style={{ color: "#4b57ad", margin: "10px 0", fontSize: "20px" }}
            >
              Number of Customers
            </h3>
            <p
              style={{ fontSize: "36px", fontWeight: "700", color: "#e5337f" }}
            >
              {data ? data.totalCustomers : "Loading..."}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#e9f5ff",
              borderRadius: "12px",
              padding: "20px",
              flex: "1 1 45%",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <PersonIcon
              fontSize="large"
              style={{ marginBottom: "10px", color: "#4b57ad" }}
            />
            <h3
              style={{ color: "#4b57ad", margin: "10px 0", fontSize: "20px" }}
            >
              Number of Employees
            </h3>
            <p
              style={{ fontSize: "36px", fontWeight: "700", color: "#e5337f" }}
            >
              {data ? data.totalEmployees : "Loading..."}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{ color: "#4b57ad", marginBottom: "20px", fontSize: "24px" }}
        >
          Ticket Status Breakdown
        </h2>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            height: "300px",
          }}
        >
          {pieChartData.labels ? (
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.label + ": " + tooltipItem.raw;
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <p>Loading Pie Chart...</p>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default AdminDashBoard;
