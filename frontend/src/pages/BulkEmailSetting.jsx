import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function BulkEmailSetting() {
  const [sendBy, setSendBy] = useState("By Name");
  const [allCustomers, setAllCustomers] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [excludedCustomers, setExcludedCustomers] = useState([]);
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [selectAllDisabled, setSelectAllDisabled] = useState(false);
  const [allSelectedMessage, setAllSelectedMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSelectedOptions([]);
    setExcludedCustomers([]); // Reset excluded customers when sendBy changes

    if (sendBy === "By Name") {
      axios
        .get("https://crm.bees.in/api/v1/customer")
        .then(response => {
          const customerOptions = response.data.map(customer => ({
            value: customer._id,
            label: `${customer.name} (${customer.phone})`,
          }));
          setAllCustomers(customerOptions);
        })
        .catch(error => console.error("Error fetching customers:", error));
    } else if (sendBy === "By Tag") {
      axios
        .get("https://crm.bees.in/api/v1/tags")
        .then(response => {
          const tagOptions = response.data.map(tag => ({
            value: tag._id,
            label: tag.name,
          }));
          setAllTags(tagOptions);
        })
        .catch(error => console.error("Error fetching tags:", error));
    } else if (sendBy === "By Group") {
      axios
        .get("https://crm.bees.in/api/v1/groups")
        .then(response => {
          const groupOptions = response.data.map(group => ({
            value: group._id,
            label: group.name,
          }));
          setAllGroups(groupOptions);
        })
        .catch(error => console.error("Error fetching groups:", error));
    }
  }, [sendBy]);

  const handleSubmit = async e => {
    e.preventDefault();
  
    // Validate the required fields
    if (
      (!selectAllDisabled && selectedOptions.length === 0) ||
      !subject ||
      !emailContent
    ) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append("message", emailContent);
    formData.append("sub", subject);
  
    // Add attachment if present
    if (attachment) {
      formData.append("file", attachment);
    }
  
    // Handle sending by different criteria (Name, Tag, Group)
    if (sendBy === "By Name") {
      // Prepare customer IDs
      const customerIdsToSend = selectAllDisabled
        ? allCustomers
            .filter(
              customer =>
                !excludedCustomers.some(
                  excluded => excluded.value === customer.value
                )
            )
            .map(customer => customer.value)
        : selectedOptions.map(option => option.value);
  
      // Append customerIds to formData
      customerIdsToSend.forEach(id => {
        formData.append("customerIds[]", id); // Adjust the key if necessary
      });
    } else if (sendBy === "By Tag") {
      // Prepare selected tag IDs
      const selectedTagIds = selectAllDisabled
        ? allTags.map(tag => tag.value) // Include all tags
        : selectedOptions.map(option => option.value);
  
      // Append tagIds[] to formData
      selectedTagIds.forEach(tagId => {
        formData.append("tagIds[]", tagId);
      });
    } else if (sendBy === "By Group") {
      // Prepare selected group IDs
      const selectedGroupIds = selectAllDisabled
        ? allGroups.map(group => group.value) // Include all groups
        : selectedOptions.map(option => option.value);
  
      // Append groupIds[] to formData
      selectedGroupIds.forEach(groupId => {
        formData.append("groupIds[]", groupId);
      });
    }
  
    // Log formData for debugging
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    // API request
    try {
      await axios.post("https://crm.bees.in/api/v1/ins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Email sent successfully!");
      
      // Reset form fields
      setSelectedOptions([]);
      setExcludedCustomers([]);
      setSubject("");
      setEmailContent("");
      setAttachment(null);
      setSelectAllDisabled(false);
      setAllSelectedMessage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Error sending email.");
      console.error("Error sending email:", error);
    }
  };
  

  const handleSelectAll = () => {
    setSelectAllDisabled(true);
    setSelectedOptions([]); // Clear current selections
    setAllSelectedMessage("");
  };

  const handleDeselectAll = () => {
    setSelectedOptions([]);
    setExcludedCustomers([]);
    setSelectAllDisabled(false);
    setAllSelectedMessage("");
  };

  const handleOptionChange = options => {
    if (selectAllDisabled) {
      setSelectedOptions([]); // Clear visual selection
    } else {
      setSelectedOptions(options || []);
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size must be 25 MB or less.");
        fileInputRef.current.value = "";
        setAttachment(null);
      } else {
        setAttachment(file);
      }
    }
  };

  // Handle excluding customers from "Select All"
  useEffect(() => {
    if (selectAllDisabled) {
      const remainingCustomers = allCustomers.filter(
        customer =>
          !excludedCustomers.some(excluded => excluded.value === customer.value)
      );
      setAllSelectedMessage(
        `${remainingCustomers.length} customers will receive the email.`
      );
    }
  }, [excludedCustomers, selectAllDisabled, allCustomers]);

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
      style={{ color: "#4b57ad" }}
    >
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#4b57ad" }}>
        Bulk Email Setting
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Send By Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="send-by-select"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Send By:
          </label>
          <Select
            id="send-by-select"
            options={[
              { value: "By Name", label: "By Name" },
              { value: "By Tag", label: "By Tag" },
              { value: "By Group", label: "By Group" },
            ]}
            value={{ value: sendBy, label: sendBy }}
            onChange={option => setSendBy(option.value)}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {/* Dynamic Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="option-select"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            {sendBy === "By Name"
              ? "Select Customer(s):"
              : sendBy === "By Tag"
              ? "Select Tag(s):"
              : "Select Group(s):"}
          </label>
          <Select
            id="option-select"
            options={
              sendBy === "By Name"
                ? allCustomers
                : sendBy === "By Tag"
                ? allTags
                : allGroups
            }
            isMulti
            value={selectAllDisabled ? [] : selectedOptions} // Prevent showing selected items
            onChange={handleOptionChange}
            placeholder={`Select ${
              sendBy === "By Name"
                ? "customers"
                : sendBy === "By Tag"
                ? "tags"
                : "groups"
            }`}
            isDisabled={selectAllDisabled}
            className="basic-single"
            classNamePrefix="select"
          />
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`bg-[#4b57ad] text-white px-4 py-2 rounded-md shadow-sm ${
                selectAllDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#4b57ad]/80"
              }`}
              disabled={selectAllDisabled}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className={`bg-red-500 text-white px-4 py-2 rounded-md shadow-sm ${
                !selectAllDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-600"
              }`}
              disabled={!selectAllDisabled}
            >
              Deselect All
            </button>
          </div>
        </div>

        {selectAllDisabled && sendBy === "By Name" && (
          <>
            <div className="space-y-2">
              <label
                htmlFor="exclude-select"
                className="block text-sm font-medium"
                style={{ color: "#4b57ad" }}
              >
                {`Select Customers You Don't Want to Send Email To:`}
              </label>
              <Select
                id="exclude-select"
                options={allCustomers}
                isMulti
                value={excludedCustomers}
                onChange={setExcludedCustomers}
                placeholder="Select excluded customers"
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            {allSelectedMessage && (
              <div className="text-sm text-gray-600">{allSelectedMessage}</div>
            )}
          </>
        )}

        {/* Subject */}
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Subject:
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Email Content */}
        <div className="space-y-2">
          <label
            htmlFor="email-content"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Email Content:
          </label>
          <textarea
            id="email-content"
            value={emailContent}
            onChange={e => setEmailContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="5"
            required
          />
        </div>

        {/* File Attachment */}
        <div className="space-y-2">
          <label
            htmlFor="attachment"
            className="block text-sm font-medium"
            style={{ color: "#4b57ad" }}
          >
            Attachment (Optional):
          </label>
          <input
            id="attachment"
            type="file"
            accept="*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#4b57ad] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#4b57ad]/80"
        >
          Send Email
        </button>
      </form>
    </div>
  );
}

export default BulkEmailSetting;
