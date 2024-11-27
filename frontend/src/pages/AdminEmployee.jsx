import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from "react-icons/fa"; // Icons for actions
import Tooltip from "@mui/material/Tooltip"; // For tooltips
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AdminEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10); // Number of employees per page
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [newEmployee, setNewEmployee] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isReassigning, setIsReassigning] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isZero, setIsZero] = useState(false);
  const navigate = useNavigate();
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedNewEmployee, setSelectedNewEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchAllEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/employee");
      setEmployees(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/employee/ticket/create"
      );
      setAllEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch all employees:", error);
    }
  };

  const handleEdit = employeeId => {
    navigate(`/admin/Employee/EmployeeEdit/${employeeId}`);
  };

  const handleDelete = async (employeeId, count) => {
    console.log(employeeId, count);
    if (count > 0) {
      setEmployeeToDelete(employeeId);
      // showAssignPopup
      // setShowAssignPopup(try)
      setShowConfirmDelete(true);
      setIsReassigning(true);
    } else {
      setShowConfirmDelete(true);
      setEmployeeToDelete(employeeId);
      setIsZero(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!isZero) {
        console.log({
          employeeId: employeeToDelete,
          newEmployeeId: newEmployee,
        });
        await axios.delete(
          `https://crm.bees.in/api/v1/employee/delete/assign/employee/${employeeToDelete}/${newEmployee}`
        );
        toast.success("Tickets reassigned successfully.");
      } else {
        await axios.put(
          `https://crm.bees.in/api/v1/employee/${employeeToDelete}`,
          { Terminate: true }
        );
      }
      setIsZero(false);
      toast.success("Employee deleted successfully.");
      setEmployeeToDelete(null);
      setNewEmployee(null);
      setIsReassigning(false);
      setShowConfirmDelete(false);
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      // console.log(error)
      toast.error("Failed to delete employee or reassign tickets.");
      // console.error("Failed to delete employee:", error);
    }
  };

  const handleCancelDelete = () => {
    setEmployeeToDelete(null);
    setNewEmployee(null);
    setIsReassigning(false);
    setShowConfirmDelete(false);
  };

  // const handleToggleActive = async (employeeId, currentStatus) => {
  //   try {
  //     await axios.put(`https://crm.bees.in/api/v1/employee/${employeeId}`, {
  //       Active: !currentStatus,
  //     });
  //     fetchEmployees(); // Refresh employee list after update
  //   } catch (error) {
  //     toast.error("Failed to update employee status.");
  //     console.error("Failed to update employee status:", error);
  //   }
  // };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.Active !== b.Active) {
        return b.Active - a.Active; // True (1) comes before False (0)
      }
      if (a.Terminate !== b.Terminate) {
        return a.Terminate - b.Terminate; // False (0) comes before True (1)
      }
      return a.name.localeCompare(b.name); // Sort by name if Active and Terminate are the same
    });

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Ensure that the total pages are based on the filtered employee count
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleDeactivateEmployee = async employee => {
    if (employee.counts === 0) {
      // Hit the PUT request to deactivate the employee if there are no tickets.
      await axios.put(`https://crm.bees.in/api/v1/employee/${employee._id}`, {
        Active: false,
      });
      toast.success("Employee deactivated successfully");
    } else {
      // If the employee has tickets (count > 0), show the popup to assign tickets.
      setShowAssignPopup(true);
      setSelectedEmployee(employee); // Save the employee details in state.
    }
  };

  const handleToggleActive = async (employeeId, currentStatus) => {
    if (currentStatus) {
      // If employee is currently active, we are trying to deactivate
      const employee = employees.find(emp => emp._id === employeeId);

      if (employee.counts === 0) {
        // Deactivate employee if no tickets
        await axios.put(`https://crm.bees.in/api/v1/employee/${employeeId}`, {
          Active: false,
        });
        toast.success("Employee deactivated successfully");
        fetchEmployees();
      } else {
        // Show popup if tickets exist
        setShowAssignPopup(true);
        setSelectedEmployee(employeeId); // Save the employee ID in state
        fetchEmployees();
      }
    } else {
      // If employee is currently inactive, we are trying to activate
      try {
        await axios.put(`https://crm.bees.in/api/v1/employee/${employeeId}`, {
          Active: true,
        });
        toast.success("Employee activated successfully");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to update employee status");
      }
    }
  };

  const handleAssignTickets = async () => {
    try {
      console.log(
        `https://crm.bees.in/api/v1/employee/delete/active/employee/${selectedEmployee}/${selectedNewEmployee.value}`
      );
      const response = await axios.get(
        `https://crm.bees.in/api/v1/employee/delete/active/employee/${selectedEmployee}/${selectedNewEmployee.value}`
      );

      // Deactivate the original employee
      await axios.put(
        `https://crm.bees.in/api/v1/employee/${selectedEmployee}`,
        { Active: false }
      );
      toast.success("Tickets assigned and employee deactivated successfully");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to assign tickets");
    } finally {
      setShowAssignPopup(false);
      setSelectedEmployee(null);
      setSelectedNewEmployee(null);
      fetchEmployees();
    }
  };

  const handleCancelAssign = () => {
    setShowAssignPopup(false);
    setSelectedEmployee(null);
    setSelectedNewEmployee(null);
  };

 
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f8ff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#434a8c",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Employees
          </h2>
          <p style={{ color: "#434a8c" }}>This is a list of all employees.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #4b57ad",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <button
            onClick={() => navigate("/admin/Employee/CreateEmployee")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4b57ad",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              {["Name", "Email", "Mobile Number", "Actions"].map(header => (
                <th
                  key={header}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    color: "#434a8c",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee._id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {employee.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {employee.email}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {employee.phone}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <Tooltip title="Edit">
                    <button
                      onClick={() => handleEdit(employee._id)}
                      style={{
                        color: "#4b57ad",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      <FaEdit size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button
                      onClick={() =>
                        handleDelete(employee._id, employee.counts)
                      }
                      style={{
                        color: "#a82727",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title={employee.Active ? "Deactivate" : "Activate"}>
                    <button
                      onClick={() =>
                        handleToggleActive(employee._id, employee.Active)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {employee.Active ? (
                        <FaToggleOn size={18} color="#4caf50" />
                      ) : (
                        <FaToggleOff size={18} color="#f44336" />
                      )}
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Stack
        spacing={2}
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </Stack>

      {showConfirmDelete && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <p
            style={{
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            {isZero
              ? "Do you really want to delete this employee?"
              : "There are tickets assigned to this employee. Please reassign them before deleting."}
          </p>
          {isReassigning && (
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="newEmployee"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Assign tickets to:
              </label>
              <Select
                inputId="newEmployee"
                options={allEmployees
                  .filter(emp => emp._id !== employeeToDelete) // Exclude the employee being deleted
                  .map(emp => ({
                    value: emp._id,
                    label: emp.name,
                  }))}
                value={
                  newEmployee
                    ? {
                        value: newEmployee,
                        label: allEmployees.find(emp => emp._id === newEmployee)
                          ?.name,
                      }
                    : null
                }
                onChange={selectedOption =>
                  setNewEmployee(selectedOption ? selectedOption.value : "")
                }
                placeholder="Select an employee"
                isSearchable
                styles={{
                  container: provided => ({
                    ...provided,
                    width: "100%",
                  }),
                }}
              />
            </div>
          )}

          <button
            onClick={handleConfirmDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4b57ad",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Confirm
          </button>
          <button
            onClick={handleCancelDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {showAssignPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "450px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "20px", fontSize: "16px" }}>
            This employee has some tickets. Please assign them to another
            employee.
          </p>
          <Select
            options={allEmployees
              .filter(emp => emp._id !== selectedEmployee) // Exclude the employee being deactivated
              .map(emp => ({
                value: emp._id,
                label: emp.name,
              }))}
            value={selectedNewEmployee}
            onChange={setSelectedNewEmployee}
            placeholder="Select an employee"
            isSearchable
            styles={{
              container: provided => ({
                ...provided,
                marginBottom: "20px",
              }),
            }}
          />
          <div
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <button
              onClick={handleAssignTickets}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4b57ad",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Assign Tickets
            </button>
            <button
              onClick={handleCancelAssign}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployee;
