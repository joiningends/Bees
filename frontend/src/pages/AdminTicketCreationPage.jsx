import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 

function AdminTicketCreationPage() {
  const [customers, setCustomers] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddCustomerPopup, setShowAddCustomerPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusFieldDisabled, setStatusFieldDisabled] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null); // New state for priority
  const [estimatedTime, setEstimatedTime] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/status/tickets/all"
      );
      const statusOptions = response.data.map(s => ({
        value: s._id,
        label: s.status,
      }));
      setStatuses(statusOptions);

      // Set 'Pending' as the default status if available
      const pendingStatus = statusOptions.find(
        status => status.label === "Pending"
      );
      setSelectedStatus(pendingStatus || null);
      console.log(selectedStatus);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    }
  };
  const handleStatusChange = selectedOption => {
    setSelectedStatus(selectedOption);
  };

  const [ticketFormData, setTicketFormData] = useState({
    comment: "",
    assignToEmployeeId: null,
  });

  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    email: "",
    customercode: "",
    phone: "",
    dob: null,
    Active: true,
    Terminate: false,
  });

  const [ticketErrors, setTicketErrors] = useState({});
  const [customerErrors, setCustomerErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchTicketTypes();
    fetchEmployees();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/customer/ticket/create"
      );
      const sortedCustomers = response.data
        .map(c => ({ value: c._id, label: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by name (label)

      setCustomers(sortedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/tickettype");
      setTicketTypes(
        response.data.map(tt => ({ value: tt._id, label: tt.name }))
      );
    } catch (error) {
      console.error("Failed to fetch ticket types:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/employee/ticket/create"
      );
      setEmployees(response.data.map(e => ({ value: e._id, label: e.name })));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleInputChange = (e, setFormData, formData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e, setFormData, formData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "true" });
  };

  const handleEmployeeChange = selectedOption => {
    setSelectedEmployee(selectedOption);
    setTicketFormData({
      ...ticketFormData,
      assignToEmployeeId: selectedOption ? selectedOption.value : null,
    });

    // Disable status field and set to 'Open'
    setStatusFieldDisabled(true);
    const openStatus = statuses.find(status => status.label === "Open");
    setSelectedStatus(openStatus);
  };
  const handleRemoveEmployee = () => {
    const stat = statuses.find(status => status.label == "Pending") || null;
    console.log(stat);
    setSelectedStatus(stat);
    setStatusFieldDisabled(false);
    setSelectedEmployee(null);
    // Optionally, add logic to update employee list or make API call if needed
  };

  const validateCustomerForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!customerFormData.name) newErrors.name = "Name is required";
    const validateEmail = email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!customerFormData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(customerFormData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!customerFormData.phone) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(customerFormData.phone))
      newErrors.phone = "Invalid Indian phone number";
    if (!customerFormData.dob) newErrors.dob = "Date of birth is required";
    if (!customerFormData.customerCode)
      newErrors.customerCode = "CustomerCode is required!";
    else if (new Date(customerFormData.dob) >= new Date())
      newErrors.dob = "Date of birth must be in the past";
    setCustomerErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTicketForm = () => {
    const newErrors = {};
    if (!ticketFormData.comment) newErrors.comment = "Comment is required";
    setTicketErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomer = async () => {
    if (!validateCustomerForm()) return;

    try {
      console.log(customerFormData);
      await axios.post("https://crm.bees.in/api/v1/customer", customerFormData);
      setShowAddCustomerPopup(false);
      fetchCustomers();
      setCustomerFormData({
        name: "",
        email: "",
        phone: "",
        dob: null,
        Active: true,
        Terminate: false,
        customercode: "",
      });
      toast.success("Customer added successfully!", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });
    } catch (error) {
      toast.error("Failed to add customer.");
      console.error("Failed to add customer:", error);
    }
  };

  const handleCreateTicket = async () => {
    // Ensure all required fields are filled
    if (
      !selectedCustomer ||
      !selectedTicketType ||
      !selectedStatus ||
      !selectedPriority ||
      !validateTicketForm() ||
      !hours ||
      !minutes
    ) {
      return toast.error("Please fill all the required fields!");
    }

    setLoading(true);

    const startdate = new Date().toISOString();
    const by = "admin";
    const status = ticketFormData.assignToEmployeeId
      ? "Open"
      : "Pending assign To Employee";

    // Use state variable 'estimatedTime' directly
    const estimatedTimeFormatted = `${hours} hours ${minutes} mins`;

    const ticketData = {
      customerId: selectedCustomer.value,
      ticketTypeId: selectedTicketType.value,
      comment: ticketFormData.comment,
      startdate,
      assignToEmployeeId: ticketFormData.assignToEmployeeId,
      by,
      status: selectedStatus.value,
      Priority: selectedPriority.value,
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
        assignToEmployeeId: null,
      });
      setSelectedCustomer(null);
      setSelectedTicketType(null);
      setSelectedEmployee(null);
      setSelectedStatus(null);
      setStatusFieldDisabled(false);
      setTimeout(() => {
        navigate("/admin/ticket/ViewEditTickets");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create ticket.");
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

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
            options={customers}
            placeholder="Select a customer"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
              }),
            }}
          />
        </label>
        <button
          onClick={() => setShowAddCustomerPopup(true)}
          style={{
            backgroundColor: "#e5337f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Add Customer
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Select Ticket Type *
          <Select
            value={selectedTicketType}
            onChange={setSelectedTicketType}
            options={ticketTypes}
            placeholder="Select a ticket type"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
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

      <label
        style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
      >
        Assign to Employee
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            options={employees}
            placeholder="Assign to employee"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
                boxShadow: "none",
                width:"20rem",
                "&:hover": {
                  border: "1px solid #e5337f",

                },
              }),
            }}
          />
          {selectedEmployee && (
            <button
              onClick={handleRemoveEmployee}
              style={{
                backgroundColor: "#e5337f",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </label>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "10px", color: "#e5337f" }}
        >
          Status *
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            options={statuses}
            isDisabled={true}
            placeholder="Select a status"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
              }),
            }}
          />
        </label>
      </div>

      <button
        onClick={handleCreateTicket}
        style={{
          backgroundColor: "#e5337f",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "10px 15px",
          cursor: "pointer",
          display: "block",
          width: "100%",
        }}
      >
        {loading ? "Creating Ticket..." : "Create Ticket"}
      </button>

      <ToastContainer />

      {showAddCustomerPopup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ color: "#e5337f", marginBottom: "20px" }}>
              Add Customer
            </h3>
            <button
              onClick={() => setShowAddCustomerPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              <FaTimes />
            </button>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Name *
                <input
                  type="text"
                  name="name"
                  value={customerFormData.name}
                  onChange={e =>
                    handleInputChange(e, setCustomerFormData, customerFormData)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5337f",
                    borderRadius: "4px",
                  }}
                />
              </label>
              {customerErrors.name && (
                <span style={{ color: "red" }}>{customerErrors.name}</span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Email *
                <input
                  type="email"
                  name="email"
                  value={customerFormData.email}
                  onChange={e =>
                    handleInputChange(e, setCustomerFormData, customerFormData)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5337f",
                    borderRadius: "4px",
                  }}
                />
              </label>
              {customerErrors.email && (
                <span style={{ color: "red" }}>{customerErrors.email}</span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Customer Code *
                <input
                  type="text"
                  name="customerCode"
                  value={customerFormData.customerCode}
                  onChange={e =>
                    handleInputChange(e, setCustomerFormData, customerFormData)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5337f",
                    borderRadius: "4px",
                  }}
                />
              </label>
              {customerErrors.customerCode && (
                <span style={{ color: "red" }}>
                  {customerErrors.customerCode}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Phone *
                <input
                  type="text"
                  name="phone"
                  value={customerFormData.phone}
                  onChange={e =>
                    handleInputChange(e, setCustomerFormData, customerFormData)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5337f",
                    borderRadius: "4px",
                  }}
                />
              </label>
              {customerErrors.phone && (
                <span style={{ color: "red" }}>{customerErrors.phone}</span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Date of Birth *
                <DatePicker
                  selected={customerFormData.dob}
                  onChange={date =>
                    setCustomerFormData({ ...customerFormData, dob: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select a date"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  showMonthDropdown
                  dropdownMode="select"
                  className="custom-datepicker-input"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5337f",
                    borderRadius: "4px",
                  }}
                />
              </label>
              {customerErrors.dob && (
                <span style={{ color: "red" }}>{customerErrors.dob}</span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Active
                <input
                  type="radio"
                  name="Active"
                  value="true"
                  checked={customerFormData.Active === true}
                  onChange={e =>
                    handleRadioChange(e, setCustomerFormData, customerFormData)
                  }
                />
                Yes
                <input
                  type="radio"
                  name="Active"
                  value="false"
                  checked={customerFormData.Active === false}
                  onChange={e =>
                    handleRadioChange(e, setCustomerFormData, customerFormData)
                  }
                />
                No
              </label>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Terminate
                <input
                  type="radio"
                  name="Terminate"
                  value="true"
                  checked={customerFormData.Terminate === true}
                  onChange={e =>
                    handleRadioChange(e, setCustomerFormData, customerFormData)
                  }
                />
                Yes
                <input
                  type="radio"
                  name="Terminate"
                  value="false"
                  checked={customerFormData.Terminate === false}
                  onChange={e =>
                    handleRadioChange(e, setCustomerFormData, customerFormData)
                  }
                />
                No
              </label>
            </div>

            <button
              onClick={handleAddCustomer}
              style={{
                backgroundColor: "#e5337f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                display: "block",
                width: "100%",
              }}
            >
              Add Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTicketCreationPage;
