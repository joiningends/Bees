import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

const Setting = () => {
  // State Management for User Details
  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    instanceId: "",
  });
  const [ticketType, setTicketType] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editTicketType, setEditTicketType] = useState({
    _id: "",
    name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State Management for Status
  const [status, setStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false);
  const [editStatus, setEditStatus] = useState({
    _id: "",
    status: "",
    Active: false,
    Terminate: false,
  });
  const [statusSearchTerm, setStatusSearchTerm] = useState("");
  const [statusCurrentPage, setStatusCurrentPage] = useState(1);
  const statusItemsPerPage = 5;
  const statusesToHideEditButton = ["Open", "Closed", "Pending"];
  // Fetching Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://crm.bees.in/api/v1/users/66b9d46ac7ac48f44cf736c7"
        );
        const user = response.data;
        setFormData({
          email: user.email,
          mobileNumber: user.mobileNumber,
          instanceId: user.instanceId,
        });
      } catch (error) {
        toast.error("Failed to fetch user data.");
      }
    };

    const fetchTicketTypes = async () => {
      try {
        const response = await axios.get(
          "https://crm.bees.in/api/v1/tickettype"
        );
        setTicketTypes(response.data);
      } catch (error) {
        toast.error("Failed to fetch ticket types.");
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await axios.get("https://crm.bees.in/api/v1/status");
        setStatuses(response.data);
      } catch (error) {
        toast.error("Failed to fetch statuses.");
      }
    };

    fetchUserData();
    fetchTicketTypes();
    fetchStatuses();
  }, []);

  // Form Handlers for User Details
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTicketTypeChange = e => {
    setTicketType(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email || !formData.mobileNumber || !formData.instanceId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await axios.put(
        "https://crm.bees.in/api/v1/users/66b9d46ac7ac48f44cf736c7",
        formData
      );
      toast.success("Settings updated successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
    } catch (error) {
      toast.error("Failed to update settings.");
    }
  };

  const handleTicketTypeSubmit = async e => {
    e.preventDefault();
    if (!ticketType) {
      toast.error("Please enter a ticket type.");
      return;
    }
    try {
      await axios.post("https://crm.bees.in/api/v1/tickettype", {
        name: ticketType,
      });
      setTicketType("");
      toast.success("Ticket type added successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      const response = await axios.get("https://crm.bees.in/api/v1/tickettype");
      setTicketTypes(response.data);
    } catch (error) {
      toast.error("Failed to add ticket type.");
    }
  };

  // Modal Handlers for Ticket Types
  const openModal = async id => {
    try {
      const response = await axios.get(
        `https://crm.bees.in/api/v1/tickettype/${id}`
      );
      setEditTicketType(response.data);
      setModalIsOpen(true);
    } catch (error) {
      toast.error("Failed to fetch ticket type.");
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditTicketType({
      ...editTicketType,
      [name]: value,
    });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(
        `https://crm.bees.in/api/v1/tickettype/${editTicketType._id}`,
        { name: editTicketType.name }
      );
      setModalIsOpen(false);
      toast.success("Ticket type updated successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      const response = await axios.get("https://crm.bees.in/api/v1/tickettype");
      setTicketTypes(response.data);
    } catch (error) {
      toast.error("Failed to update ticket type.");
    }
  };

  // Search and Pagination for Ticket Types
  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const filteredTicketTypes = ticketTypes.filter(ticket =>
    ticket.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredTicketTypes.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const displayedTickets = filteredTicketTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form Handlers for Status
  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  const handleStatusSubmit = async e => {
    e.preventDefault();
    if (!status) {
      toast.error("Please enter a status.");
      return;
    }
    try {
      await axios.post("https://crm.bees.in/api/v1/status", {
        status,
      });
      setStatus("");
      toast.success("Status added successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      const response = await axios.get("https://crm.bees.in/api/v1/status");
      setStatuses(response.data);
    } catch (error) {
      toast.error("Failed to add status.");
    }
  };

  const openStatusModal = async id => {
    try {
      const response = await axios.get(
        `https://crm.bees.in/api/v1/status/${id}`
      );
      setEditStatus(response.data);
      setStatusModalIsOpen(true);
    } catch (error) {
      toast.error("Failed to fetch status.");
    }
  };

  const handleStatusEditChange = e => {
    const { name, value } = e.target;
    setEditStatus(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleStatusEditRadioChange = e => {
    const { value } = e.target;
    setEditStatus(prevState => ({
      ...prevState,
      Active: value === "Active",
      Terminate: value === "Terminate",
    }));
  };

  const handleStatusEditSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://crm.bees.in/api/v1/status/${editStatus._id}`, {
        status: editStatus.status,
        Active: editStatus.Active,
        Terminate: editStatus.Terminate,
      });
      setStatusModalIsOpen(false);
      toast.success("Status updated successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      const response = await axios.get("https://crm.bees.in/api/v1/status");
      setStatuses(response.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // Search and Pagination for Status
  const handleStatusSearch = e => {
    setStatusSearchTerm(e.target.value);
  };

  const filteredStatuses = statuses.filter(status =>
    status.status?.toLowerCase().includes(statusSearchTerm.toLowerCase())
  );

  const statusPageCount = Math.ceil(
    filteredStatuses.length / statusItemsPerPage
  );

  const handleStatusPageChange = (event, value) => {
    setStatusCurrentPage(value);
  };

  const displayedStatuses = filteredStatuses.slice(
    (statusCurrentPage - 1) * statusItemsPerPage,
    statusCurrentPage * statusItemsPerPage
  );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f8ff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#434a8c",
          marginBottom: "20px",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Admin Details
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "40px",
        }}
      >
        <label
          htmlFor="email"
          style={{
            fontWeight: "bold",
            color: "#434a8c",
          }}
        >
          Admin Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
            marginTop: "0", // Removed extra space above input
          }}
        />

        <label
          htmlFor="mobileNumber"
          style={{
            fontWeight: "bold",
            color: "#434a8c",
          }}
        >
          Admin Mobile Number
        </label>
        <input
          type="text"
          id="mobileNumber"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          style={{
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
            marginTop: "0", // Removed extra space above input
          }}
        />

        <label
          htmlFor="instanceId"
          style={{
            fontWeight: "bold",
            color: "#434a8c",
          }}
        >
          WhatsApp Instance ID
        </label>
        <input
          type="text"
          id="instanceId"
          name="instanceId"
          placeholder="Instance ID"
          value={formData.instanceId}
          onChange={handleChange}
          style={{
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
            marginTop: "0", // Removed extra space above input
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          Update
        </button>
      </form>

      <h2
        style={{
          textAlign: "center",
          color: "#434a8c",
          margin: "20px 0",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Ticket Types
      </h2>
      <form
        onSubmit={handleTicketTypeSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter ticket type..."
          value={ticketType}
          onChange={handleTicketTypeChange}
          style={{
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the content horizontally
            gap: "5px",
          }}
        >
          <FaPlus /> Add
        </button>
      </form>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search ticket types..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            flexGrow: 1,
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
          }}
        />
        <button
          style={{
            padding: "10px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaSearch />
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #4b57ad",
                padding: "10px",
                backgroundColor: "#f5f8ff",
                color: "#434a8c",
              }}
            >
              Ticket Type
            </th>
            <th
              style={{
                border: "1px solid #4b57ad",
                padding: "10px",
                backgroundColor: "#f5f8ff",
                color: "#434a8c",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.map(ticket => (
            <tr key={ticket._id}>
              <td
                style={{
                  border: "1px solid #4b57ad",
                  padding: "10px",
                  backgroundColor: "#fff",
                }}
              >
                {ticket.name}
              </td>
              <td
                style={{
                  border: "1px solid #4b57ad",
                  padding: "10px",
                  backgroundColor: "#fff",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => openModal(ticket._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4b57ad",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaEdit /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Ticket Type"
        style={{
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "20rem",
          },
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#434a8c",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Edit Ticket Type
        </h2>
        <form
          onSubmit={handleEditSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            name="name"
            value={editTicketType.name}
            onChange={handleEditChange}
            style={{
              padding: "10px",
              border: "1px solid #4b57ad",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              transition: "border 0.3s",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4b57ad",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Save Changes
          </button>
        </form>
        <button
          onClick={() => setModalIsOpen(false)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "block",
            width: "100%",
          }}
        >
          Close
        </button>
      </Modal>

      <h2
        style={{
          textAlign: "center",
          color: "#434a8c",
          margin: "20px 0",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Status
      </h2>
      <form
        onSubmit={handleStatusSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter status..."
          value={status}
          onChange={handleStatusChange}
          style={{
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <FaPlus /> Add
        </button>
      </form>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search status..."
          value={statusSearchTerm}
          onChange={handleStatusSearch}
          style={{
            flexGrow: 1,
            padding: "10px",
            border: "1px solid #4b57ad",
            borderRadius: "4px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border 0.3s",
          }}
        />
        <button
          style={{
            padding: "10px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaSearch />
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #4b57ad",
                padding: "10px",
                backgroundColor: "#f5f8ff",
                color: "#434a8c",
              }}
            >
              Status
            </th>
            <th
              style={{
                border: "1px solid #4b57ad",
                padding: "10px",
                backgroundColor: "#f5f8ff",
                color: "#434a8c",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedStatuses?.map(status => (
            <tr key={status._id}>
              <td
                style={{
                  border: "1px solid #4b57ad",
                  padding: "10px",
                  backgroundColor: "#fff",
                }}
              >
                {status.status}
              </td>
              <td
                style={{
                  border: "1px solid #4b57ad",
                  padding: "10px",
                  backgroundColor: "#fff",
                  textAlign: "center",
                }}
              >
                {!statusesToHideEditButton.includes(status.status) && (
                  <button
                    onClick={() => openStatusModal(status._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4b57ad",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        count={statusPageCount}
        page={statusCurrentPage}
        onChange={handleStatusPageChange}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      />

      <Modal
        isOpen={statusModalIsOpen}
        onRequestClose={() => setStatusModalIsOpen(false)}
        contentLabel="Edit Status"
        style={{
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxHeight: "20rem",
          },
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#434a8c",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Edit Status
        </h2>
        <form
          onSubmit={handleStatusEditSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            name="status"
            value={editStatus.status}
            onChange={handleStatusEditChange}
            style={{
              padding: "10px",
              border: "1px solid #4b57ad",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              transition: "border 0.3s",
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="active"
                name="statusType"
                value="Active"
                checked={editStatus.Active}
                onChange={handleStatusEditRadioChange}
                style={{
                  accentColor: "#4b57ad", // Color for the radio button
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="active"
                style={{
                  margin: 0,
                  color: "#434a8c",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Active
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="radio"
                id="terminate"
                name="statusType"
                value="Terminate"
                checked={editStatus.Terminate}
                onChange={handleStatusEditRadioChange}
                style={{
                  accentColor: "#4b57ad", // Color for the radio button
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor="terminate"
                style={{
                  margin: 0,
                  color: "#434a8c",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Disable
              </label>
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4b57ad",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Save Changes
          </button>
        </form>
        <button
          onClick={() => setStatusModalIsOpen(false)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4b57ad",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "block",
            width: "100%",
          }}
        >
          Close
        </button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Setting;
