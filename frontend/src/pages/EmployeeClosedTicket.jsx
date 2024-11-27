import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function EmployeeClosedTicket() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    if (userId) {
      fetch(`https://crm.bees.in/api/v1/ticket/status/Closed/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setTickets(data))
        .catch(error => console.error("Error fetching tickets:", error));
    } else {
      console.error("User ID not found in local storage");
    }
  }, []);

  const filteredTickets = tickets.filter(
    ticket =>
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "#4b57ad" }}>
            Closed Tickets
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            This is a list of all closed tickets. You can view details of each
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
                      className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                    >
                      End Date
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
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
                        <td className="whitespace-nowrap px-12 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(ticket.endDate).toLocaleDateString()}
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-900"
                      >
                        No closed tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeClosedTicket;
