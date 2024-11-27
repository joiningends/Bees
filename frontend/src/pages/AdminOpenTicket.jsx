import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AdminOpenTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    fetch("https://crm.bees.in/api/v1/ticket/status/Open")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          setTickets([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching tickets:", error);
        setTickets([]);
        setLoading(false);
      });
  };

  const handleEditClick = ticket => {
    setSelectedTicket(ticket);
    setViewMode(false);
  };

  const handleViewClick = ticket => {
    setSelectedTicket(ticket);
    setViewMode(true);
  };

  const handleEndDateChange = event => {
    setEndDate(event.target.value);
  };

  const handleSave = () => {
    if (!endDate) return;

    const selectedDate = new Date(endDate);
    const currentTime = new Date();
    selectedDate.setHours(currentTime.getHours());
    selectedDate.setMinutes(currentTime.getMinutes());
    selectedDate.setSeconds(currentTime.getSeconds());
    selectedDate.setMilliseconds(currentTime.getMilliseconds());
    const formattedEndDate = selectedDate.toISOString();

    setLoading(true);
    fetch(`https://crm.bees.in/api/v1/ticket/update/${selectedTicket._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: formattedEndDate,
        status: "Closed",
      }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setSelectedTicket(null);
        fetchTickets();
        toast.success("Ticket updated successfully!", {
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

  const filteredTickets = tickets.filter(
    ticket =>
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <Toaster />
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#4b57ad" }}>
            Open Tickets
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            This is a list of all open tickets. You can view details of each
            ticket.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center p-6">
                  <div className="loader">Loading...</div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        <span>Ticket Number</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Customer Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentTickets?.map(ticket => (
                      <tr key={ticket._id}>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.ticketNumber}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(ticket.startdate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {ticket.customerId.name}
                          </div>
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-4 text-sm text-gray-900"
                          style={{ color: "#e5337f" }}
                        >
                          {ticket.status}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-center">
                          <div className="flex justify-center items-center space-x-4 w-full">
                            <button
                              onClick={() => handleViewClick(ticket)}
                              className="text-gray-700"
                              style={{ color: "#4b57ad" }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditClick(ticket)}
                              className="text-gray-700"
                              style={{ color: "#4b57ad" }}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <Pagination
              ticketsPerPage={ticketsPerPage}
              totalTickets={filteredTickets.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: "#4b57ad" }}
            >
              {viewMode ? "View Ticket" : "Edit Ticket"}
            </h3>
            <form>
              {viewMode ? (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        color: "#434a8c",
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
                        border: "1px solid #e5337f",
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
                        color: "#434a8c",
                      }}
                    >
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={new Date(
                        selectedTicket.startdate
                      ).toLocaleDateString()}
                      readOnly
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e5337f",
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
                        color: "#434a8c",
                      }}
                    >
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={selectedTicket.customerId.name}
                      readOnly
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e5337f",
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
                        color: "#434a8c",
                      }}
                    >
                      Status
                    </label>
                    <input
                      type="text"
                      value={selectedTicket.status}
                      readOnly
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e5337f",
                        borderRadius: "4px",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm"
                      style={{ backgroundColor: "#e5337f", color: "#fff" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-5 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm"
                      style={{ backgroundColor: "#4b57ad", color: "#fff" }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
                      style={{ backgroundColor: "#4b57ad", color: "#fff" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

const Pagination = ({
  ticketsPerPage,
  totalTickets,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTickets / ticketsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        {pageNumbers?.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 ${
                number === currentPage ? "bg-primary-600 text-white" : ""
              }`}
              style={{
                backgroundColor: number === currentPage ? "#4b57ad" : "",
                color: number === currentPage ? "#fff" : "",
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminOpenTickets;
