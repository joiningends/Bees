import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AdminPendingTickets() {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchEmployees();
    fetchTicketTypes();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    fetch("https://crm.bees.in/api/v1/ticket/status/Pending assign To Employee")
      .then(response => response.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      });
  };

  const fetchEmployees = () => {
    fetch("https://crm.bees.in/api/v1/employee")
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error("Error fetching employees:", error));
  };

  const fetchTicketTypes = () => {
    fetch("https://crm.bees.in/api/v1/tickettype")
      .then(response => response.json())
      .then(data => setTicketTypes(data))
      .catch(error => console.error("Error fetching ticket types:", error));
  };

  const handleEditClick = ticket => {
    setSelectedTicket(ticket);
    setViewMode(false);
  };

  const handleViewClick = ticket => {
    setSelectedTicket(ticket);
    setViewMode(true);
  };

  const handleEmployeeChange = event => {
    setSelectedEmployeeId(event.target.value);
  };

  const handleAssign = () => {
    if (!selectedEmployeeId) return;

    setLoading(true);
    fetch(`https://crm.bees.in/api/v1/ticket/${selectedTicket._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignToEmployeeId: selectedEmployeeId,
        startTime: new Date().toISOString(), // This includes both date and time
      }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setSelectedTicket(null);
        fetchTickets();
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

  const getTicketTypeName = ticketTypeId => {
    const ticketType = ticketTypes.find(type => type._id === ticketTypeId);
    return ticketType ? ticketType.name : "";
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <Toaster />
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#4b57ad" }}>
            Pending Tickets
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            This is a list of all pending tickets. You can view details of each
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
                        className="relative px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentTickets.map(ticket => (
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
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-center items-center space-x-2 mr-5">
                            <button
                              onClick={() => handleEditClick(ticket)}
                              className="text-gray-700 mr-2 "
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewClick(ticket)}
                              className="text-gray-700"
                            >
                              View
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
              {viewMode ? "Ticket Details" : "Edit Ticket"}
            </h3>
            <form className="space-y-4">
              {viewMode ? (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="block text-sm font-medium text-gray-700">
                      Ticket Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={selectedTicket.ticketNumber}
                        disabled
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={new Date(
                          selectedTicket.startdate
                        ).toLocaleDateString()}
                        disabled
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={selectedTicket.customerId.name}
                        disabled
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={selectedTicket.status}
                        disabled
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{ color: "#e5337f" }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label className="block text-sm font-medium text-gray-700">
                      Assign to Employee
                    </label>
                    <div className="mt-1">
                      <select
                        value={selectedEmployeeId}
                        onChange={handleEmployeeChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                          <option key={employee._id} value={employee._id}>
                            {employee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                {!viewMode && (
                  <button
                    type="button"
                    onClick={handleAssign}
                    className="px-4 py-2 text-white rounded-md"
                    style={{ backgroundColor: "#4b57ad" }}
                  >
                    Assign
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Pagination({ ticketsPerPage, totalTickets, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTickets / ticketsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="inline-flex -space-x-px">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-2 border border-gray-300 ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500"
              }`}
              style={{
                backgroundColor: currentPage === number ? "#434a8c" : "white",
                color: currentPage === number ? "white" : "#4b57ad",
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminPendingTickets;
