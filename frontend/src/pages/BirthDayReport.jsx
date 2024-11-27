import { useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import GridLoader from "react-spinners/GridLoader";

function BirthDayReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Number of entries per page

  // Function to parse and format date
  const formatDate = dateString => {
    const [day, month, year] = dateString.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(`${year}-${month}-${day}`);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date
      .toLocaleDateString("en-GB", options)
      .replace(
        /(\d{2}) (\w{3}) (\d{4})/,
        `$1 ${monthNames[parseInt(month) - 1]} $3`
      );
  };

  const handleDropdownChange = async e => {
    const value = e.target.value;
    setLoading(true);
    try {
      let response;
      if (value === "1") {
        response = await axios.get(
          "https://crm.bees.in/api/v1/reports/birthday/1"
        );
      } else if (value === "2") {
        response = await axios.get(
          "https://crm.bees.in/api/v1/reports/birthday/2"
        ); // Update this URL accordingly
      }
      setData(response.data);
    } catch (error) {
      console.error("Error fetching birthday data", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <label
          htmlFor="birthday-dropdown"
          className="block mb-2 text-lg font-semibold text-gray-700"
        >
          Select Option:
        </label>
        <select
          id="birthday-dropdown"
          onChange={handleDropdownChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">--Select an option--</option>
          <option value="1">Birthday message sent today</option>
          <option value="2">
            Birthday message that will be sent in the next 7 days
          </option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center items-center">
          <GridLoader color="#4b57ad" />
        </div>
      ) : data.length === 0 ? (
        <div className="mt-6 flex justify-center items-center">
          <Alert severity="info">No data found</Alert>
        </div>
      ) : (
        <div className="mt-6 flex flex-col">
          <div className="relative -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                        Name
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                        Email
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                        Phone
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                        DOB
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-normal text-gray-700">
                        Customer Code
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map(item => (
                        <tr key={item._id}>
                          <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                            {item.name || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                            {item.email || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                            {item.phone || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                            {formatDate(item.dob)}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-900">
                            {item.customercode || "N/A"}
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
            count={Math.ceil(data.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}

export default BirthDayReport;
