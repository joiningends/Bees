import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaFileExcel,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaDownload,
} from "react-icons/fa";
import { Button, Pagination } from "@mui/material";
import Tooltip from "@mui/material/Tooltip"; // For tooltips
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/customer");
      const sortedCustomers = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCustomers(sortedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to fetch customers.");
    }
  };

  const handleEdit = customerId => {
    navigate(`/admin/Customer/CustomerEdit/${customerId}`);
  };

  const handleDeleteClick = customer => {
    setCustomerToDelete(customer);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://crm.bees.in/api/v1/customer/delete/all/${customerToDelete._id}`
      );

      toast.success(`Customer ${customerToDelete.name} deleted successfully.`);
      setShowDeletePopup(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer.");
    }
  };

  const handleCloseDeletePopup = () => {
    setShowDeletePopup(false);
    setCustomerToDelete(null);
  };

  const handleImportClick = () => {
    setShowImportPopup(true);
  };

  const handleClosePopup = () => {
    setShowImportPopup(false);
  };

  const handleFileUpload = async event => {
    setLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("https://crm.bees.in/api/v1/customer/upload", formData);
      toast.success("File uploaded successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to upload file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "https://crm.bees.in/CustomerNew.xlsx"; // Adjust the path as needed
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const filteredCustomers = customers
    .filter(
      customer =>
        customer.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const handleAddCustomer = () => {
    navigate("/admin/Customer/CreateCustomer");
  };

  const handleExportCustomer = async () => {
    try {
      const response = await axios.get(
        "https://crm.bees.in/api/v1/customer/downlod/export/all",
        {
          responseType: "blob", // Adjust if needed based on the response type
        }
      );

      // Logic to handle the response, like downloading the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers_export.xlsx"); // Set the appropriate file name and extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting customers:", error);
      // Handle the error appropriately
    }
  };

  return (
    <div
      style={{
        maxWidth: "10000px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f8ff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
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
            Customers
          </h2>
          <p style={{ color: "#434a8c" }}>This is a list of all customers.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #434a8c",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleImportClick}
              style={{
                backgroundColor: "#434a8c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textAlign: "left",
              }}
            >
              <FaFileExcel />
              Import Customers
            </Button>
            <button
              onClick={handleExportCustomer}
              style={{
                backgroundColor: "#434a8c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textAlign: "left",
              }}
            >
              <FaDownload style={{ marginRight: "5px" }} />
              Export Customer
            </button>
            <Button
              onClick={handleAddCustomer}
              style={{
                backgroundColor: "#434a8c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textAlign: "left",
              }}
            >
              <FaPlus />
              Add Customer
            </Button>
          </div>
        </div>

        <Pagination
          count={Math.ceil(customers.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          sx={{
            mt: 2,
            "& .MuiPaginationItem-root": {
              color: "#434a8c",
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#434a8c",
            },
            "& .Mui-selected": {
              backgroundColor: "#434a8c",
              color: "#fff",
            },
          }}
        />
      </div>

      <div style={{ overflowX: "auto", maxHeight: "400px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              backgroundColor: "#f0f0f0",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              {[
                "Name",
                "Email",
                "Customer Code",
                "Mobile Number",
                "Active",
                "Actions",
              ].map(header => (
                <th
                  key={header}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    color: "#434a8c",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer._id}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {customer.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {customer.email}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {customer.customercode}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {customer.phone}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "12px",
                      backgroundColor: customer.Active ? "#d4f8d4" : "#f8d4d4",
                      color: customer.Active ? "#2b9348" : "#d14040",
                    }}
                  >
                    {customer.Active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px", // Same padding as other cells
                    borderBottom: "1px solid #ddd", // Consistent bottom border
                    textAlign: "left",
                    verticalAlign: "middle", // Align icons with the middle of the row
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex", // Aligns icons horizontally
                      gap: "10px",
                    }}
                  >
                    <Tooltip title="Edit">
                      <FaEdit
                        onClick={() => handleEdit(customer._id)}
                        style={{
                          color: "#434a8c",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <FaTrashAlt
                        onClick={() => handleDeleteClick(customer)}
                        style={{
                          color: "#e74c3c",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>
              Confirm Delete
            </h3>
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>
              Are you sure you want to delete{" "}
              <strong>{customerToDelete?.name}</strong>?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <Button
                onClick={handleConfirmDelete}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={handleCloseDeletePopup}
                style={{
                  backgroundColor: "#434a8c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Customers Popup */}
      {showImportPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ color: "#434a8c", marginBottom: "10px" }}>
              Import Customers
            </h3>
            <p style={{ marginBottom: "20px" }}>
              Upload a file to import customers. You can download a template to
              use for your import.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <Button
                onClick={handleDownloadTemplate}
                style={{
                  backgroundColor: "#434a8c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  textAlign: "left",
                }}
              >
                Download Template
              </Button>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={loading}
                style={{
                  display: "none",
                }}
                id="fileUpload"
              />
              <label htmlFor="fileUpload">
                <Button
                  component="span"
                  style={{
                    backgroundColor: "#434a8c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    textAlign: "left",
                  }}
                >
                  {loading ? "Uploading..." : "Upload File"}
                </Button>
              </label>
            </div>
            <Button
              onClick={handleClosePopup}
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textAlign: "left",
              }}
            >
              <FaTimes />
              Close
            </Button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminCustomer;
