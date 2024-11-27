import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import Select from "react-select";
import { ThreeDots } from "react-loader-spinner"; // Correct import
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
function CustomerTicket() {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [modalStatuses, setModalStatuses] = useState([]);
  const [selectedModalStatusId, setSelectedModalStatusId] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  useEffect(() => {
    fetch("https://crm.bees.in/api/v1/status/tickets/all")
      .then(response => response.json())
      .then(data => {
        setStatuses(data);
      })
      .catch(error => {
        console.error("Error fetching statuses:", error);
      });
  }, []);

  const handleStatusChange = event => {
    const statusId = event.target.value;
    setSelectedStatusId(statusId);
    setLoading(true);
    console.log(statusId);

    // Check if 'All tickets' is selected
    if (statusId === "all") {
      const userId = JSON.parse(localStorage.getItem("user")).userId;

      fetch(`https://crm.bees.in/api/v1/ticket/all/cusotmer/${userId}`)
        .then(response => response.json())
        .then(data => {
          setTickets(Array.isArray(data) ? data.reverse() : []); // Reverse the array if data is an array
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching all tickets:", error);
          setTickets([]); // Ensure tickets is an array
          setLoading(false);
        });
    } else {
      const userId = JSON.parse(localStorage.getItem("user")).userId;

      // Existing logic for fetching tickets by status
      fetch(
        `https://crm.bees.in/api/v1/ticket/status/${statusId}/coustomer/${userId}`
      )
        .then(response => response.json())
        .then(data => {
          setTickets(Array.isArray(data) ? data : []); // Ensure tickets is an array
          console.log(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching tickets:", error);
          setTickets([]); // Ensure tickets is an array
          setLoading(false);
        });
    }
  };

  const getStatusNameById = statusId => {
    const status = statuses.find(status => status._id === statusId);
    return status ? status.status : "";
  };

  const handleView = ticket => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleEdit = ticket => {
    setSelectedTicket(ticket);

    const statusName = getStatusNameById(ticket.status);
    if (
      statusName === "Open" ||
      (statusName !== "Pending" && statusName !== "Closed")
    ) {
      setIsCloseModalOpen(true);
    } else {
      fetch("https://crm.bees.in/api/v1/employee")
        .then(response => response.json())
        .then(data => {
          setEmployees(data);
          setIsEditModalOpen(true);
        })
        .catch(error => {
          console.error("Error fetching employees:", error);
        });
    }
  };

  const handleAssign = () => {
    if (!selectedEmployeeId) return;
    console.log();
    const openStatus = statuses.find(status => status.status === "Open");
    const openStatusId = openStatus ? openStatus._id : null;

    setLoading(true);
    fetch(`https://crm.bees.in/api/v1/ticket/${selectedTicket._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignToEmployeeId: selectedEmployeeId?._id,
        status: openStatusId,
        startTime: new Date().toISOString(),
      }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setSelectedTicket(null);
        fetchTickets();
        setIsEditModalOpen(false);
        toast.success("Ticket assigned successfully!", {
          style: {
            backgroundColor: "#92a143", // Your custom color
            color: "#ffffff", // Text color, if needed
          },
        });
      })
      .catch(error => {
        console.error("Error updating ticket:", error);
        setLoading(false);
      });
  };

  const handleSave = async () => {
    const currentTime = new Date().toISOString();
    setLoading(true);

    try {
      axios.put(
        `https://crm.bees.in/api/v1/ticket/update/${selectedTicket._id}`,
        {
          endDate: currentTime,
          status: selectedModalStatusId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      setSelectedTicket(null);
      fetchTickets();
      setIsCloseModalOpen(false);
      toast.success("Ticket updated successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      const openStatus = statuses.find(status => status.status === "Open");
      if (openStatus) {
        setSelectedStatusId(openStatus._id);
        fetchTickets(openStatus._id);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      setLoading(false);
    }
  };

  const fetchTickets = () => {
    const userId = JSON.parse(localStorage.getItem("user")).userId;

    fetch(
      `https://crm.bees.in/api/v1/ticket/status/${selectedStatusId}/coustomer/${userId}`
    )
      .then(response => response.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []); // Ensure tickets is an array
      })
      .catch(error => {
        console.error("Error fetching tickets:", error);
        setTickets([]); // Ensure tickets is an array
      });
  };

  const employeeOptions = employees.map(employee => ({
    value: employee._id,
    label: employee.name,
  }));

  const statusOptions = modalStatuses?.map(status => ({
    value: status._id,
    label: status.status,
  }));

  useEffect(() => {
    if (isCloseModalOpen) {
      fetch("https://crm.bees.in/api/v1/status/tickets/all")
        .then(response => response.json())
        .then(data => {
          setModalStatuses(data);
        })
        .catch(error => {
          console.error("Error fetching modal statuses:", error);
        });
    }
  }, [isCloseModalOpen]);

  const isClosedStatus = statusId => {
    const statusName = getStatusNameById(statusId);
    return statusName === "Closed";
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayTickets = (tickets || []).slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getPriorityIcon = priority => {
    switch (priority) {
      case "Low":
        return <FaCircle style={{ color: "green" }} />;
      case "Medium":
        return <FaCircle style={{ color: "orange" }} />;
      case "High":
        return <FaCircle style={{ color: "red" }} />;
      default:
        return null;
    }
  };

  const selectedStatusName = getStatusNameById(selectedStatusId);

  return (
    <div className="p-4">
      <ToastContainer />
      <label
        htmlFor="status-select"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Select Status:
      </label>
      {/* Select Status Dropdown */}
      <select
        id="status-select"
        value={selectedStatusId}
        onChange={handleStatusChange}
        className="block w-full p-3 border border-gray-300 rounded-lg mb-4 shadow-md hover:shadow-lg transition-shadow duration-300 appearance-none"
        style={{
          backgroundColor: "#4b57ad",
          color: "#fff",
          fontSize: "16px",
          backgroundImage:
            "url(\"data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23fff' class='bi bi-chevron-down' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          paddingRight: "2.5rem",
        }}
      >
        {/* New default option */}
        <option value="all">All Tickets</option>
        <option value="" disabled>
          Select a status
        </option>
        {statuses?.map(status => (
          <option key={status._id} value={status._id}>
            {status.status}
          </option>
        ))}
      </select>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <span
          style={{ display: "flex", alignItems: "center", marginRight: "15px" }}
        >
          <FaCircle style={{ color: "green", marginRight: "5px" }} />
          Low Priority
        </span>
        <span
          style={{ display: "flex", alignItems: "center", marginRight: "15px" }}
        >
          <FaCircle style={{ color: "orange", marginRight: "5px" }} />
          Medium Priority
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FaCircle style={{ color: "red", marginRight: "5px" }} />
          High Priority
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <ThreeDots color="#4b57ad" height={80} width={80} />
        </div>
      ) : tickets.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-center"></th>
                <th className="py-2 px-4 border-b text-center">
                  Ticket Number
                </th>
                <th className="py-2 px-4 border-b text-center">
                  Customer Name
                </th>
                <th className="py-2 px-4 border-b text-center">
                  Employee Name
                </th>
                <th className="py-2 px-4 border-b text-center">Start Date</th>
                {selectedStatusId === "all" && (
                  <th scope="col" className="py-2 px-4 border-b text-center">
                    Status
                  </th>
                )}

                {(selectedStatusName === "Closed" ||
                  selectedStatusId === "all") && (
                  <th scope="col" className="py-2 px-4 border-b text-center">
                    End Date
                  </th>
                )}

                <th className="py-2 px-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayTickets.map(ticket => (
                <>
                  <tr key={ticket._id}>
                    <td className="py-2 px-4 border-b text-center">
                      {getPriorityIcon(ticket.Priority)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {ticket?.ticketNumber}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {ticket.customerId?.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {ticket?.assignToEmployeeId
                        ? ticket.assignToEmployeeId?.name
                        : "-"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(ticket.startdate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}{" "}
                      {new Date(ticket.startdate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // This will give you the time in 12-hour format with AM/PM
                      })}
                    </td>
                    {selectedStatusId === "all" && (
                      <td className="py-2 px-4 border-b text-center">
                        {ticket.status?.status}
                      </td>
                    )}

                    {(selectedStatusName === "Closed" ||
                      selectedStatusId === "all") && (
                      <td className="py-2 px-4 border-b text-center">
                        {ticket.endDate
                          ? `${new Date(ticket.endDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              }
                            )} ${new Date(ticket.endDate).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true, // 12-hour format with AM/PM
                              }
                            )}`
                          : "-"}
                      </td>
                    )}

                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleView(ticket)}
                        className="mr-1 px-2 py-1 bg-blue-500 text-white rounded-md"
                        style={{ backgroundColor: "#4b57ad" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                  <tr key={ticket._id + "-comment"}>
                    <td
                      colSpan={selectedStatusName === "Closed" ? 7 : 6}
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <strong>Comment:</strong>{" "}
                      {ticket.comment.split(" ").slice(0, 20).join(" ")}...
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(tickets.length / ticketsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .Mui-selected": {
                    backgroundColor: "#4b57ad",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#4b57ad",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: "#4b57ad",
                  },
                }}
              />
            </Stack>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center">
          <p>No tickets available</p>
        </div>
      )}

      {selectedTicket && (
        <Modal
          isOpen={isViewModalOpen}
          onRequestClose={() => setIsViewModalOpen(false)}
          className="modal"
          style={{
            content: {
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              width: "80%", // Updated to use percentage for responsiveness
              maxWidth: "600px", // Adjust maxWidth as needed
              maxHeight: "90vh", // Set max height to viewport height
              margin: "auto",
              overflowY: "auto", // Allow vertical scrolling
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#4b57ad" }}>
              Ticket Details
            </h2>
            {/* <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Ticket Number
              </label>
              <input
                type="text"
                value={selectedTicket.ticketNumber}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Start Date
              </label>
              <input
                type="text"
                value={new Date(selectedTicket.startdate).toLocaleDateString()}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Customer Name
              </label>
              <input
                type="text"
                value={selectedTicket?.customerId?.name}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              />
            </div> */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Ticket Priority
              </label>
              <input
                type="text"
                value={selectedTicket?.Priority}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Ticket Type
              </label>
              <input
                type="text"
                value={selectedTicket?.ticketTypeId?.name}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#4b57ad",
                }}
              >
                Comment During Ticket Creation
              </label>
              <textarea
                value={selectedTicket?.comment}
                readOnly
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #4b57ad",
                  borderRadius: "4px",
                  marginTop: "5px",
                  minHeight: "13rem",
                  resize: "none", // To prevent resizing
                  overflow: "auto", // To handle overflow text
                  boxSizing: "border-box", // To include padding and border in width and height
                }}
              />
            </div>

            {selectedStatusName !== "Closed" &&
              selectedStatusName !== "Open" && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      color: "#4b57ad",
                    }}
                  >
                    Comment During Ticket Status Change
                  </label>
                  <textarea
                    value={selectedTicket?.statusComment}
                    readOnly
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #4b57ad",
                      borderRadius: "4px",
                      marginTop: "5px",
                      minHeight: "13rem",
                      resize: "none", // To prevent resizing
                      overflow: "auto", // To handle overflow text
                      boxSizing: "border-box", // To include padding and border in width and height
                    }}
                  />
                </div>
              )}
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm"
                style={{ backgroundColor: "#4b57ad", color: "#fff" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {selectedTicket && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          className="modal"
          style={{
            content: {
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              width: "500px",
              maxWidth: "90%",
              margin: "auto",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#4b57ad" }}>
              Assign Ticket
            </h2>
            <Select
              options={employeeOptions}
              onChange={option => setSelectedEmployeeId(option.value)}
            />
            <button
              onClick={handleAssign}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="ml-2 mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {isCloseModalOpen && (
        <Modal
          isOpen={isCloseModalOpen}
          onRequestClose={() => setIsCloseModalOpen(false)}
          className="modal"
          style={{
            content: {
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
              width: "500px",
              maxWidth: "90%",
              margin: "auto",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#4b57ad" }}>
              Close Ticket
            </h2>
            <div style={{ marginBottom: "20px" }}>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <Select
                  options={statusOptions}
                  onChange={option => setSelectedModalStatusId(option.value)}
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsCloseModalOpen(false)}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CustomerTicket;
