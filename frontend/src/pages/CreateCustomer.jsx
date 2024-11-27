import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

const CreateCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    customercode: "",
    Active: true,
    Tags: [], // Store selected tag IDs
    groups: null, // Single group ID
  });

  const [tagOptions, setTagOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const navigate = useNavigate();

  // Fetch tags and groups from their respective endpoints
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("https://crm.bees.in/api/v1/tags");
        const options = response.data.map(tag => ({
          value: tag._id,
          label: tag.name,
        }));
        setTagOptions(options);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get("https://crm.bees.in/api/v1/groups");
        const options = response.data.map(group => ({
          value: group._id,
          label: group.name,
        }));
        setGroupOptions(options);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchTags();
    fetchGroups();
  }, []);

  // Handle form input changes
  const handleChange = (name, value) => {
    if (name === "Active") {
      value = value === "true"; // Convert string to boolean
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Tags and Group selection from dropdowns
  const handleSelectChange = (selectedOption, field) => {
    if (field === "Tags") {
      const selectedTagIds = selectedOption
        ? selectedOption.map(option => option.value)
        : [];
      setFormData(prevData => ({
        ...prevData,
        [field]: selectedTagIds,
      }));
    } else {
      const selectedId = selectedOption ? selectedOption.value : null;
      setFormData(prevData => ({
        ...prevData,
        [field]: selectedId,
      }));
    }
  };

  // Format date to match required format
  const formatDate = dateString => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.customercode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate phone number
    const phonePattern = /^[+]?[0-9]{10,15}$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    // Prepare the form data for submission
    const formattedData = {
      ...formData,
      dob: formData.dob ? formatDate(formData.dob) : "",
      groups: formData.groups || null, // Ensure groups field is properly populated
      Tags: formData.Tags.length > 0 ? formData.Tags : null, // Ensure Tags are correctly populated
    };

    console.log(formattedData)

    try {
      // Uncomment when ready to submit data
      await axios.post("https://crm.bees.in/api/v1/customer", formattedData);
      toast.success("Customer created successfully!", {
        style: {
          backgroundColor: "#92a143",
          color: "#ffffff",
        },
      });
      setTimeout(() => {
        navigate("/Admin/Customer");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f8ff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#e5337f",
          marginBottom: "20px",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Create Customer
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => handleChange("name", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={e => handleChange("email", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="phone"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Phone
          </label>
          <PhoneInput
            country={"in"}
            value={formData.phone}
            onChange={phone => handleChange("phone", phone)}
            containerStyle={{
              width: "100%",
              borderColor: "#e5337f",
            }}
            inputStyle={{
              border: "1px solid #e5337f",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="dob"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={e => handleChange("dob", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="customercode"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Customer Code
          </label>
          <input
            type="text"
            id="customercode"
            value={formData.customercode}
            onChange={e => handleChange("customercode", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="groups"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Group
          </label>
          <Select
            options={groupOptions}
            onChange={option => handleSelectChange(option, "groups")}
            value={groupOptions.find(
              option => option.value === formData.groups
            )}
            isClearable
            placeholder="Select Group"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
                borderRadius: "4px",
              }),
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="Tags"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Tags
          </label>
          <Select
            options={tagOptions}
            onChange={option => handleSelectChange(option, "Tags")}
            value={tagOptions.filter(option =>
              formData.Tags.includes(option.value)
            )}
            isMulti
            placeholder="Select Tags"
            styles={{
              control: provided => ({
                ...provided,
                border: "1px solid #e5337f",
                borderRadius: "4px",
              }),
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="Active"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Active
          </label>
          <div>
            <label style={{ marginRight: "10px", color: "#e5337f" }}>
              <input
                type="checkbox"
                checked={formData.Active}
                onChange={e => handleChange("Active", e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              Yes
            </label>
            <label style={{ color: "#e5337f" }}>
              <input
                type="checkbox"
                checked={!formData.Active}
                onChange={e => handleChange("Active", !e.target.checked)}
                style={{ marginRight: "5px" }}
              />
              No
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#e5337f",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCustomer;
