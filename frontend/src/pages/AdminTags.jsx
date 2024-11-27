import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiEye } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tagsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerData, setCustomerData] = useState([]); // For customer popup data
  const [showPopup, setShowPopup] = useState(false); // Show or hide popup
  const [customerPage, setCustomerPage] = useState(1); // Current page in popup pagination
  const [customersPerPage] = useState(10); // Number of customers per page in popup

  // Fetch tags from API on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("https://crm.bees.in/api/v1/tags");
        setTags(response.data);
      } catch (err) {
        setError("Error fetching tags");
        toast.error("Error fetching tags");
      }
    };
    fetchTags();
  }, []);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleAddTag = async e => {
    e.preventDefault();
    if (newTag.trim()) {
      try {
        setLoading(true);
        const response = await axios.post("https://crm.bees.in/api/v1/tags", {
          name: newTag.trim(),
        });
        setTags([...tags, response.data]); // Add the new tag to the list
        setNewTag("");
        setLoading(false);
        toast.success("Tag added successfully!");
      } catch (err) {
        setError("Error adding tag");
        toast.error("Error adding tag");
        setLoading(false);
      }
    }
  };

  const handleDeleteTag = async _id => {
    try {
      setLoading(true);
      console.log(`https://crm.bees.in/api/v1/tags/${_id}`)
      await axios.delete(`https://crm.bees.in/api/v1/tags/${_id}`);
      setTags(tags.filter(tag => tag._id !== _id)); // Remove tag from state
      setLoading(false);
      toast.success("Tag deleted successfully!");
    } catch (err) {
      setError("Error deleting tag");
      toast.error("Error deleting tag");
      setLoading(false);
    }
  };

  const handleEditTag = async (_id, newName) => {
    try {
      setLoading(true);
      await axios.put(`https://crm.bees.in/api/v1/tags/${_id}`, {
        name: newName,
      });
      setTags(
        tags.map(tag => (tag._id === _id ? { ...tag, name: newName } : tag))
      );
      closeModal();
      setLoading(false);
      toast.success("Tag updated successfully!");
    } catch (err) {
      setError("Error updating tag");
      toast.error("Error updating tag");
      setLoading(false);
    }
  };

  const handleView = async tagId => {
    try {
      const response = await axios.get(
        `https://crm.bees.in/api/v1/tags/customers/${tagId}`
      );
      setCustomerData(response.data); // Save the customer data to display in the popup
      setShowPopup(true); // Open the popup
    } catch (error) {
      console.error("Failed to fetch customers", error);
      toast.error("Failed to fetch customers");
    }
  };

  const openEditModal = tag => {
    setTagToEdit(tag);
    setEditedTagName(tag.name);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setTagToEdit(null);
    setEditedTagName("");
  };

  // Filter tags based on search term
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for tags
  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstTag, indexOfLastTag);

  // Total number of pages for tags
  const totalPages = Math.ceil(filteredTags.length / tagsPerPage);

  // Pagination logic for customer data in popup
  const indexOfLastCustomer = customerPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customerData.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Total number of pages for customers
  const totalCustomerPages = Math.ceil(customerData.length / customersPerPage);

  const renderPaginationButtons = (total, current, setCurrent) => {
    const buttons = [];
    for (let i = 1; i <= total; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`px-4 py-2 rounded-md ${
            i === current
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-[#4b57ad]">Tags</h1>

      <form onSubmit={handleAddTag} className="mb-6 flex">
        <input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="Enter new tag"
          className="flex-grow p-2 border border-[#4b57ad] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#4b57ad]"
        />
        <button
          type="submit"
          className="bg-[#4b57ad] text-white p-2 rounded-r-md hover:bg-opacity-90 transition duration-300 flex items-center"
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
              <FiPlus className="mr-1" /> Add Tag
            </>
          )}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search tags"
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
              <th className="px-4 py-2 text-left">Tag Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTags.map(tag => (
              <tr
                key={tag._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{tag.name}</td>
                <td className="px-4 py-2 flex">
                  <button
                    onClick={() => openEditModal(tag)}
                    className="text-[#4b57ad] hover:text-opacity-80 mr-2"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag._id)}
                    className="text-red-500 hover:text-opacity-80 mr-2"
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    onClick={() => handleView(tag._id)} // View button
                    className="text-green-500 hover:text-opacity-80"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {renderPaginationButtons(totalPages, currentPage, setCurrentPage)}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
            <h2 className="text-xl font-bold mb-4 text-[#4b57ad]">Edit Tag</h2>
            <input
              type="text"
              value={editedTagName}
              onChange={e => setEditedTagName(e.target.value)}
              className="w-full p-2 border border-[#4b57ad] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b57ad]"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition duration-300 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleEditTag(tagToEdit._id, editedTagName);
                }}
                className="bg-[#4b57ad] text-white p-2 rounded-md hover:bg-opacity-90 transition duration-300"
              >
                {loading ? "Updating..." : "Update Tag"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Data Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4">
            <h2 className="text-xl font-bold mb-4 text-[#4b57ad]">
              Customer Data
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-[#4b57ad] text-white">
                    <th className="px-4 py-2 text-left">Customer Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone Number</th>

                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map(customer => (
                    <tr
                      key={customer._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.email}</td>
                      <td className="px-4 py-2">{customer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Close
              </button>
              <div className="flex">
                {renderPaginationButtons(
                  totalCustomerPages,
                  customerPage,
                  setCustomerPage
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTags;
