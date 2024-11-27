import React, { useEffect, useState } from "react";
import axios from "axios";
import { GridLoader } from "react-spinners";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function DeleteReport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState("N/A");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDateRange, setIsDateRange] = useState(false);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    } else if (!fromDate && !toDate) {
      fetchData();
    }
  }, [fromDate, toDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isDateRange
        ? `https://crm.bees.in/api/v1/reports/deleted/ticket/date?fromDate=${fromDate}&toDate=${toDate}`
        : "https://crm.bees.in/api/v1/reports/deleted/ticket";

      const response = await axios.get(url);
      console.log(response);
      setTickets(response.data.tickets || []);
      setAverageTurnaroundTime(response.data.averageTurnaroundTime || "N/A");
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setShowTable(false);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const downloadUrl = isDateRange
        ? `https://crm.bees.in/api/v1/reports/deleted/ticket/date/csv?fromDate=${fromDate}&toDate=${toDate}`
        : "https://crm.bees.in/api/v1/reports/deleted/ticket/csv";

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setFromDate(value);
    } else {
      setToDate(value);
    }
    setIsDateRange(true);
  };

  // Function to format date in the desired format
  const formatDateTime = dateTime => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6">
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={e => handleDateChange("from", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split("T")[0],
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={e => handleDateChange("to", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split("T")[0],
          }}
        />
      </div>

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
            <div className="flex justify-end mb-4">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4b57ad",
                  color: "#ffffff",
                }}
                onClick={handleDownload}
              >
                Download Report
              </Button>
            </div>

            <div className="relative -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 shadow sm:rounded-lg">
                  <div className="px-4 py-2 flex justify-end">
                    <div className="text-sm font-medium text-gray-2000">
                      Average Turnaround Time: {averageTurnaroundTime || "N/A"}
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
                        <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                          Remark
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
                              {formatDateTime(ticket.startdate)}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {formatDateTime(ticket.endDate)}
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
                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                              {ticket.Remark || "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <Pagination
                    className="mt-4"
                    count={Math.ceil(tickets.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DeleteReport;
