import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function EmployeeTicketCreation() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketFormData, setTicketFormData] = useState({
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null); // New state for priority
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchTicketTypes();
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/status/tickets/all"
      );
      const filteredStatuses = response.data.filter(
        status => status.status !== "Pending"
      );
      setStatuses(filteredStatuses);

      // Set "Open" as the default selected status
      const openStatus = filteredStatuses.find(
        status => status.status === "Open"
      );
      setSelectedStatus({ value: openStatus._id, label: openStatus.status });
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/customer/ticket/create"
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/tickettype");
      setTicketTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch ticket types:", error);
    }
  };

  const handleInputChange = (e, setFormData, formData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const statusOptions = statuses?.map(status => ({
    value: status._id,
    label: status.status,
  }));

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const validateTicketForm = () => {
    const newErrors = {};
    if (!selectedCustomer) newErrors.customer = "Customer is required";
    if (!selectedTicketType) newErrors.ticketType = "Ticket type is required";
    if (!selectedStatus) newErrors.status = "Status is required";
    if (!selectedPriority) newErrors.priority = "Priority is required"; // Add this line
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTicket = async () => {
    if (!validateTicketForm()) {
      return toast.error("Please fill all the required fields!");
    }

    setLoading(true);

    const startdate = new Date().toISOString();
    const by = "admin";
    const status = "Open";

    // Retrieve userId from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    const estimatedTimeFormatted = `${hours} hours ${minutes} mins`;
    const ticketData = {
      customerId: selectedCustomer.value,
      ticketTypeId: selectedTicketType.value,
      status: selectedStatus.value,
      Priority: selectedPriority.value, // Add this line
      comment: ticketFormData.comment,
      startdate,
      assignToEmployeeId: userId,
      by,
      estimatetime: estimatedTimeFormatted,
    };

    console.log(ticketData);

    try {
      axios.post("https://crm.bees.in/api/v1/ticket", ticketData);
      toast.success("Ticket created successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
      setTicketFormData({
        comment: "",
      });
      setSelectedCustomer(null);
      setSelectedTicketType(null);
      setSelectedStatus(null);
      setSelectedPriority(null); // Add this line
      setTimeout(() => {
        navigate("/Employee/Open");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create ticket.");
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const customerOptions = customers.map(customer => ({
    value: customer._id,
    label: customer.name,
  }));

  const ticketTypeOptions = ticketTypes.map(ticketType => ({
    value: ticketType._id,
    label: ticketType.name,
  }));

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f8ff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          color: "#e5337f",
          marginBottom: "20px",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Ticket Creation
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Select Customer *
          <Select
            value={selectedCustomer}
            onChange={setSelectedCustomer}
            options={customerOptions}
            styles={{
              control: base => ({
                ...base,
                border: "1px solid #e5337f",
                borderRadius: "4px",
                padding: "5px",
              }),
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Select Ticket Type *
          <Select
            value={selectedTicketType}
            onChange={setSelectedTicketType}
            options={ticketTypeOptions}
            styles={{
              control: base => ({
                ...base,
                border: "1px solid #e5337f",
                borderRadius: "4px",
                padding: "5px",
              }),
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Comment *
          <textarea
            name="comment"
            value={ticketFormData.comment}
            onChange={e =>
              handleInputChange(e, setTicketFormData, ticketFormData)
            }
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
              height: "10rem",
            }}
          />
        </label>
      </div>

      <div className="form-group" style={{ marginBottom: "1rem" }}>
        <label htmlFor="estimatedTime" style={{ color: "#e5337f" }}>
          Estimated Turnaround Time (hours and minutes) *
        </label>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select
            id="hours"
            value={hours}
            onChange={e => setHours(e.target.value)}
            required
            style={{
              border: "1px solid #e5337f",
              color: "#333",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "16px",
              flex: "1",
              boxSizing: "border-box",
            }}
          >
            <option value="" disabled>
              Select hours
            </option>
            {[...Array(24).keys()].map(h => (
              <option key={h} value={h}>
                {h} hr{h > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <select
            id="minutes"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            required
            style={{
              border: "1px solid #e5337f",
              color: "#333",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "16px",
              flex: "1",
              boxSizing: "border-box",
            }}
          >
            <option value="" disabled>
              Select minutes
            </option>
            {[...Array(60).keys()].map(m => (
              <option key={m} value={m}>
                {m} min{m > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Select Status *
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            isDisabled={true} // Disable the dropdown
            styles={{
              control: base => ({
                ...base,
                border: "1px solid #e5337f",
                borderRadius: "4px",
                padding: "5px",
              }),
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Select Priority *
          <Select
            value={selectedPriority}
            onChange={setSelectedPriority}
            options={priorityOptions}
            styles={{
              control: base => ({
                ...base,
                border: "1px solid #e5337f",
                borderRadius: "4px",
                padding: "5px",
              }),
            }}
          />
        </label>
      </div>

      <button
        onClick={handleCreateTicket}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#e5337f",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "10px 15px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Ticket"}
      </button>
      <ToastContainer />
    </div>
  );
}

export default EmployeeTicketCreation;
