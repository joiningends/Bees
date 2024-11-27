import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiEye } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; // react-select for searchable dropdown

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [editedGroupHead, setEditedGroupHead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersPerPage] = useState(5);
  const [groupHeadOptions, setGroupHeadOptions] = useState([]);
  const [selectedGroupHead, setSelectedGroupHead] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState({}); // For storing customer data

  useEffect(() => {
    fetchGroups();
    fetchAvailableGroups(); // Fetch groups for searchable dropdown
  }, []);

  useEffect(() => {
    axios
      .get("https://crm.bees.in/api/v1/customer")
      .then(response => {
        const options = response.data.map(customer => ({
          value: customer._id,
          label: customer.name,
        }));
        setGroupHeadOptions(options);
      })
      .catch(error => {
        console.error("Error fetching group head data:", error);
      });
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/groups");
      setGroups(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Error fetching groups");
    }
  };

  const fetchAvailableGroups = async () => {
    try {
      const response = await axios.get("https://crm.bees.in/api/v1/groups");
      const groupOptions = response.data.map(group => ({
        label: group.name,
        value: group._id,
      }));
      setAvailableGroups(groupOptions);
    } catch (error) {
      toast.error("Error fetching available groups");
    }
  };

  const handleDeleteGroup = async id => {
    try {
      await axios.delete(`https://crm.bees.in/api/v1/groups/${id}`);
      setGroups(groups.filter(group => group._id !== id));
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  const handleOpenEditModal = group => {
    setCurrentGroup(group);
    setEditedGroupName(group.name);
    const groupHead = groupHeadOptions.find(
      option => option.value === group.grouphead
    );
    setEditedGroupHead(groupHead || null); // Preselect the value
    setIsEditModalOpen(true);
  };

  const handleEditGroup = async () => {
    if (!editedGroupName.trim() || !editedGroupHead) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.put(
        `https://crm.bees.in/api/v1/groups/${currentGroup._id}`,
        {
          name: editedGroupName.trim(),
          grouphead: editedGroupHead.value, // Send the selected group head ID
        }
      );
      setGroups(
        groups.map(group =>
          group._id === currentGroup._id ? response.data : group
        )
      );
      setIsEditModalOpen(false);
      toast.success("Group updated successfully");
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );

  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded-md ${
            i === currentPage
              ? "bg-[#4b57ad] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } mx-1 transition duration-300`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleViewCustomers = async groupId => {
    try {
      const response = await axios.get(
        `https://crm.bees.in/api/v1/groups/customers/${groupId}`
      );
      setCustomers(response.data);

      // Find the group to get the group head information
      const group = groups.find(g => g._id === groupId);
      setCurrentGroup(group); // Store the current group for reference

      setIsViewModalOpen(true);
    } catch (error) {
      toast.error("There are no customers in this group");
    }
  };

  const indexOfLastCustomer = customersPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  console.log(currentCustomers);

  const totalCustomerPages = Math.ceil(customers.length / customersPerPage);

  const renderCustomerPagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalCustomerPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCustomersPage(i)}
          className={`px-4 py-2 rounded-md ${
            i === customersPage
              ? "bg-[#4b57ad] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } mx-1 transition duration-300`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!groupName || !selectedGroupHead) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const formData = {
      name: groupName.trim(), // Assuming this is the name of the group
      grouphead: selectedGroupHead.value, // Send the selected group head ID
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://crm.bees.in/api/v1/groups",
        formData
      );
      toast.success("Group added successfully!");
      // Clear the form after successful submission
      setGroupName("");
      setGroups([...groups, response.data]);
      setSelectedGroupHead(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGroupHeadName = groupHeadId => {
    const customer = groupHeadOptions.find(
      customer => customer.value === groupHeadId
    );
    return customer ? customer.label : "Unknown";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-[#4b57ad]">Groups</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="groupName"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter group name"
            required
          />
        </div>

        {/* Select Group Head Dropdown */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="groupHead"
          >
            Select Group Head
          </label>
          <Select
            id="groupHead"
            value={selectedGroupHead}
            onChange={setSelectedGroupHead}
            options={groupHeadOptions}
            placeholder="Search and select group head..."
            isClearable
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#4b57ad] text-white px-4 py-2 rounded-lg bg-[#4b57ad]"
          >
            {isSubmitting ? "Submitting..." : "Add Group"}
          </button>
        </div>
      </form>

      {/* <div className="mb-6">
        <label
          htmlFor="selectGroup"
          className="block mb-2 font-medium text-[#4b57ad]"
        >
          Search and Select Group
        </label>
        <Select
          id="selectGroup"
          options={availableGroups}
          value={selectedGroup}
          onChange={setSelectedGroup}
          placeholder="Select a group"
          className="text-black"
        />
      </div> */}

      <div className="mb-4 relative mt-4">
        <input
          type="text"
          placeholder="Search groups"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-10 border border-[#4b57ad] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b57ad]"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b57ad]" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#4b57ad] text-white">
              <th className="px-4 py-2 text-center">Group Name</th>
              <th className="px-4 py-2 text-center">Group Head</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map(group => (
              <tr
                key={group._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-center">{group.name}</td>
                <td className="px-4 py-2 text-center">
                  {getGroupHeadName(group.grouphead)}
                </td>
                <td className="px-4 py-2 text-center flex justify-center">
                  <button
                    onClick={() => handleOpenEditModal(group)}
                    className="text-[#4b57ad] hover:text-opacity-80 mr-2"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="text-red-500 hover:text-opacity-80 mx-2"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    onClick={() => handleViewCustomers(group._id)}
                    className="text-[#4b57ad] hover:text-opacity-80 ml-2"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {renderPaginationButtons()}
      </div>

      {/* View Customers Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#4b57ad]">
              Customers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-[#4b57ad] text-white">
                    <th className="px-6 py-3 text-center">Customer Name</th>
                    <th className="px-6 py-3 text-center">Contact Info</th>
                    <th className="px-6 py-3 text-center">Group Head</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map(customer => (
                    <tr
                      key={customer._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        customer._id === currentGroup.grouphead
                          ? "bg-yellow-200 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-3 text-center">{customer.name}</td>
                      <td className="px-6 py-3 text-center">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {customer._id === currentGroup.grouphead && (
                          <span className="text-red-500 font-bold">
                            Group Head
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center">
              {renderCustomerPagination()}
            </div>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {isEditModalOpen && currentGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#4b57ad]">
              Edit Group
            </h2>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditGroup();
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="editedGroupName"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="editedGroupName"
                  value={editedGroupName}
                  onChange={e => setEditedGroupName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  placeholder="Enter group name"
                  required
                />
              </div>

              {/* Select Group Head Dropdown */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="editedGroupHead"
                >
                  Select Group Head
                </label>
                <Select
                  id="editedGroupHead"
                  value={editedGroupHead}
                  onChange={setEditedGroupHead}
                  options={groupHeadOptions}
                  placeholder="Search and select group head..."
                  isClearable
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4b57ad] text-white px-4 py-2 rounded-lg hover:bg-[#4b57ad]"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroups;
