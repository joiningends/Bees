import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { IconButton, Pagination, Alert } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { GridLoader } from "react-spinners";
import { Autocomplete, TextField } from "@mui/material";
import Select from "react-select";

function ReportByTicketType() {
  const [option, setOption] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [selectedTicketTypeName, setSelectedTicketTypeName] = useState("");
  const [ticketStatuses, setTicketStatuses] = useState([]); // New state for ticket statuses
  const [selectedTicketStatus, setSelectedTicketStatus] = useState(""); // New state for selected ticket status
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for selected status (all or specific)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
  const [selectedTicketStatuses, setSelectedTicketStatuses] = useState([]);
  const [selectedCustomerNames, setSelectedCustomerNames] = useState([]);
  const [selectedAllCustomers, setSelectedAllCustomers] = useState(false);
  console.log(tickets);

  useEffect(() => {
    axios
      .get("https://crm.bees.in/api/v1/tickettype")
      .then(response => {
        setTicketTypes(response.data);
      })
      .catch(error => {
        toast.error("Failed to fetch ticket types");
        console.error("There was an error fetching the ticket types!", error);
      });
    // Fetch ticket statuses
    axios
      .get("https://crm.bees.in/api/v1/status/tickets/all") // Fetch ticket statuses
      .then(response => {
        setTicketStatuses(response.data); // Store ticket statuses in state
      })
      .catch(error => {
        toast.error("Failed to fetch ticket statuses");
        console.error(
          "There was an error fetching the ticket statuses!",
          error
        );
      });
  }, []);
  const handleTicketStatusChange = e => {
    // New handler for ticket status
    setSelectedTicketStatus(e.target.value);
  };
  const handleOptionChange = selectedOption => {
    setOption(selectedOption);
    setShowTable(false);
    setFromDate("");
    setToDate("");
    setTickets([]);
    setAverageTurnaroundTime("");
  };
  const handleSelectAllStatusChange = e => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedStatus("all"); // Set selected status to 'all'
      setSelectedTicketStatus(""); // Clear selected ticket status
    } else {
      setSelectedStatus(""); // Clear selected status
      setSelectedTicketStatus(""); // Reset ticket status dropdown
    }
  };

  const handleTicketTypeChange = e => {
    const selectedType = e.target.value;
    const selectedTypeName =
      ticketTypes.find(type => type._id === selectedType)?.name || "";
    setSelectedTicketType(selectedType);
    setSelectedTicketTypeName(selectedTypeName);
  };

  const handleFetchData = () => {
    if (selectedCustomerNames.length === 0 && !selectedAllCustomers) {
      toast.error("Please select at least one Customer Name");
      return;
    }

    if (option === "specific" && (!fromDate || !toDate)) {
      toast.error("Please select both from and to dates");
      return;
    }

    setLoading(true);

    const ticketTypeIds = selectedCustomerNames
      .map(type => type.value)
      .join(",");
    const ticketStatusIds = selectedTicketStatuses
      .map(status => status.value)
      .join(",");

    const url =
      option === "all"
        ? `https://crm.bees.in/api/v1/reports/closed/type?${
            selectedAllCustomers ? "" : `ticketTypeIds=${ticketTypeIds}`
          }${selectedStatus === "all" ? "" : `&statusIds=${ticketStatusIds}`}`
        : `https://crm.bees.in/api/v1/reports/date/type?${
            selectedAllCustomers ? "" : `ticketTypeIds=${ticketTypeIds}`
          }${
            selectedStatus === "all" ? "" : `&statusIds=${ticketStatusIds}`
          }&fromDate=${fromDate}&toDate=${toDate}`;
    console.log(url);
    axios
      .get(url)
      .then(response => {
        setLoading(false);
        setTickets(response.data.tickets);
        setAverageTurnaroundTime(response.data.averageTurnaroundTime);
        setShowTable(true);
      })
      .catch(error => {
        setLoading(false);
        toast.error("Failed to fetch data");
        console.error("There was an error fetching the data!", error);
      });
  };
  const handleDownload = () => {
    if (
      (selectedTicketTypes.length === 0 && !selectedAllCustomers) ||
      (selectedStatus !== "all" && selectedTicketStatuses.length === 0)
    ) {
      toast.error("Please select both ticket types and statuses");
      return;
    }

    if (option === "specific" && (!fromDate || !toDate)) {
      toast.error("Please select both from and to dates");
      return;
    }

    const ticketTypeIds = selectedTicketTypes.map(type => type.value).join(",");
    const ticketStatusIds = selectedTicketStatuses
      .map(status => status.value)
      .join(",");

    const url =
      option === "all"
        ? `https://crm.bees.in/api/v1/reports/csv/type?${
            selectedAllCustomers ? "" : `ticketTypeIds=${ticketTypeIds}`
          }${selectedStatus === "all" ? "" : `&statusIds=${ticketStatusIds}`}`
        : `https://crm.bees.in/api/v1/reports/csv/date/type?${
            selectedAllCustomers ? "" : `ticketTypeIds=${ticketTypeIds}`
          }${
            selectedStatus === "all" ? "" : `&statusIds=${ticketStatusIds}`
          }&fromDate=${fromDate}&toDate=${toDate}`;

    axios
      .get(url, {
        responseType: "blob",
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const fileName = `report_${selectedTicketTypes
          .map(type => type.label)
          .join("_")}_${
          option === "specific" ? `${fromDate}_to_${toDate}` : "all"
        }.xlsx`;
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("File downloaded successfully", {
          style: {
            backgroundColor: "#92a143",
            color: "#ffffff",
          },
        });
      })
      .catch(error => {
        toast.error("Failed to download file");
        console.error("There was an error downloading the file!", error);
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setOption(null);
    setSelectedTicketType("");
    setSelectedTicketTypeName("");
    setFromDate("");
    setToDate("");
    setSelectedTicketStatus("");
    setSelectedStatus("");
    setShowTable(false);
    setTickets([]);
    setAverageTurnaroundTime("");
    setPage(1); // Optionally reset pagination to the first page
    setSelectedAllCustomers(false); // Re-enable the dropdown
    setSelectedCustomerNames([]); // Clear customer names again
    setSelectedTicketStatuses([])
  };

  const today = new Date().toISOString().split("T")[0];
  const options = ticketTypes.map(type => ({
    value: type._id,
    label: type.name,
  }));

  const statusOptions = ticketStatuses.map(status => ({
    value: status._id,
    label: status.status,
  }));

  const handleSelectAllCustomersChange = e => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedAllCustomers(true); // Disable the dropdown
      setSelectedCustomerNames([]); // Clear selected customer names
    } else {
      setSelectedAllCustomers(false); // Re-enable the dropdown
      setSelectedCustomerNames([]); // Clear customer names again
    }
  };
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <Toaster />
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#4b57ad" }}>
            Report By Ticket Type
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            Select an option to view the report.
          </p>
        </div>
        {showTable && tickets.length > 0 && (
          <div className="flex items-center">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
            >
              <GetAppIcon className="mr-2" />
              Download Report
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="mr-4">Select Ticket Type:</label>
        <Select
          options={options} // Options for customer names
          value={selectedCustomerNames} // Currently selected customer names
          onChange={setSelectedCustomerNames} // Function to update selected customers
          placeholder="Select Ticket Type"
          className="w-full md:w-auto"
          styles={{
            control: base => ({
              ...base,
              borderColor: "#ccc",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#aaa",
              },
            }),
          }}
          isClearable
          isMulti // Enable multi-select
          isDisabled={selectedAllCustomers} // Disable if 'Select All' is checked
        />
        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={selectedAllCustomers} // State for 'Select All'
              onChange={handleSelectAllCustomersChange} // Function to toggle 'Select All'
              className="mr-2"
            />
            Select All Ticket Type
          </label>
        </div>
      </div>
      <div className="mt-6">
        <label className="mr-4">Select Ticket Status:</label>
        <Select
          options={statusOptions}
          value={selectedTicketStatuses}
          onChange={setSelectedTicketStatuses}
          placeholder="Select Ticket Status"
          isDisabled={selectedStatus === "all"} // Disable if 'all' is selected
          isMulti // Enable multi-select
          styles={{
            control: base => ({
              ...base,
              borderColor: "#ccc",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#aaa",
              },
            }),
          }}
        />
        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={selectedStatus === "all"}
              onChange={handleSelectAllStatusChange}
              className="mr-2"
            />
            Select All Ticket Statuses
          </label>
        </div>
      </div>

      <div className="mt-6">
        <label className="mr-4">
          <input
            type="radio"
            name="reportOption"
            value="all"
            onChange={() => handleOptionChange("all")}
            checked={option === "all"}
            className="mr-2"
          />
          All Data
        </label>
        <label>
          <input
            type="radio"
            name="reportOption"
            value="specific"
            onChange={() => handleOptionChange("specific")}
            checked={option === "specific"}
            className="mr-2"
          />
          Specific Date
        </label>
      </div>

      {option === "all" && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleFetchData}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "#4b57ad" }}
          >
            Show Report
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "#4b57ad" }}
          >
            Reset
          </button>
        </div>
      )}

      {option === "specific" && (
        <div className="mt-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <label className="mr-2">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
              max={today} // Prevent future dates
            />
          </div>
          <div>
            <label className="mr-2">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
              max={today} // Prevent future dates
            />
          </div>
          <div>
            <button
              onClick={handleFetchData}
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: "#4b57ad" }}
            >
              Show Report
            </button>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: "#4b57ad" }}
          >
            Reset
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 flex justify-center items-center">
          <GridLoader color="#4b57ad" />
        </div>
      ) : (
        showTable &&
        (tickets.length === 0 ? (
          <div className="mt-6 flex justify-center items-center">
            <Alert severity="info">No data found</Alert>
          </div>
        ) : (
          <div className="mt-6 flex flex-col">
            <div className="relative -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 shadow sm:rounded-lg">
                  <div className="px-4 py-2 flex justify-end">
                    <div className="text-sm font-medium text-gray-2000">
                      Average Turnaround Time: {averageTurnaroundTime || "N/A"}{" "}
                      {/* Display N/A if averageTurnaroundTime is missing */}
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Ticket Number
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Customer Name
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Status
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Employee Name
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Start Time
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          End Time
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Turnaround Time
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Estimate Time
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Extra Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {tickets
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                        .map(ticket => (
                          <tr key={ticket._id}>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.ticketNumber || "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.customerId?.name || "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              <div
                                style={{
                                  border: `1px solid ${
                                    ticket.status?.status === "Closed"
                                      ? "lightgreen"
                                      : "red"
                                  }`,
                                  backgroundColor:
                                    ticket.status?.status === "Closed"
                                      ? "#ccffcc"
                                      : "#ffcccc",
                                  color:
                                    ticket.status?.status === "Closed"
                                      ? "#2e7d32"
                                      : "#d32f2f",
                                  padding: "3px",
                                  borderRadius: "4px",
                                  textAlign: "center",
                                }}
                              >
                                {ticket.status?.status || "N/A"}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.assignToEmployeeId?.name || "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.startdate
                                ? new Date(ticket.startdate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  ) +
                                  " " +
                                  new Date(
                                    ticket.startdate
                                  ).toLocaleTimeString()
                                : "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.endDate
                                ? new Date(ticket.endDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  ) +
                                  " " +
                                  new Date(ticket.endDate).toLocaleTimeString()
                                : "N/A"}
                            </td>

                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.turnaroundTime || "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.estimatetime || "N/A"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.extraTime || "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Pagination
              className="mt-6 self-center"
              count={Math.ceil(tickets.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        ))
      )}
    </section>
  );
}

export default ReportByTicketType;
