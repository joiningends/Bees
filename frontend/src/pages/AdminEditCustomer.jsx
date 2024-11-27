import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

const AdminEditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    Active: "Yes",
    customercode: "",
    tags: [],
    groups: null,
  });

  const [tagsOptions, setTagsOptions] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);

  useEffect(() => {
    const fetchTagsAndGroups = async () => {
      try {
        const tagsResponse = await axios.get("https://crm.bees.in/api/v1/tags");
        const groupsResponse = await axios.get(
          "https://crm.bees.in/api/v1/groups"
        );

        const fetchedTags = tagsResponse.data.map(tag => ({
          value: tag._id,
          label: tag.name,
        }));

        const fetchedGroups = groupsResponse.data.map(group => ({
          value: group._id,
          label: group.name,
        }));

        setTagsOptions(fetchedTags);
        setGroupsOptions(fetchedGroups);

        fetchCustomerData(fetchedTags, fetchedGroups);
      } catch (error) {
        toast.error("Failed to fetch tags or groups data.");
      }
    };

    const fetchCustomerData = async (tagsOptions, groupsOptions) => {
      try {
        console.log("Fetching customer data for ID:", id); // Log the ID
        const customerResponse = await axios.get(
          `https://crm.bees.in/api/v1/customer/${id}`
        );

        if (customerResponse.status !== 200) {
          throw new Error(
            `Error fetching customer: ${customerResponse.statusText}`
          );
        }

        const customer = customerResponse.data;
        console.log("Customer Data:", customer); // Log the received customer data

        const preselectedTags = Array.isArray(customer.Tags)
          ? tagsOptions.filter(tag => customer.Tags.includes(tag.value))
          : [];

        setFormData(prevFormData => ({
          ...prevFormData,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          dob: customer.dob ? convertToISODate(customer.dob) : "",
          Active: customer.Active ? "Yes" : "No",
          customercode: customer.customercode || "",
          tags: preselectedTags,
          groups:
            (customer.groups &&
              groupsOptions.find(group =>
                customer.groups.includes(group.value)
              )) ||
            null,
        }));
      } catch (error) {
        console.error("Error fetching customer data:", error); // Log the actual error
        toast.error("Failed to fetch customer data.");
      }
    };

    fetchTagsAndGroups();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePhoneChange = value => {
    setFormData(prevFormData => ({
      ...prevFormData,
      phone: value,
    }));
  };

  const handleTagsChange = selectedOptions => {
    setFormData(prevFormData => ({
      ...prevFormData,
      tags: selectedOptions || [],
    }));
  };

  const handleGroupsChange = selectedOption => {
    setFormData(prevFormData => ({
      ...prevFormData,
      groups: selectedOption,
    }));
  };

  const formatDate = dateString => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const convertToISODate = dateString => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.dob) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.phone) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const formattedData = {
      ...formData,
      dob: formatDate(formData.dob),
      Active: formData.Active === "Yes",
      Tags: formData.tags.map(tag => tag.value), // Send array of tag IDs
      groups: formData.groups ? [formData.groups.value] : [],
    };

    // Replace empty strings, undefined values, and empty arrays with null
    Object.keys(formattedData).forEach(key => {
      if (
        formattedData[key] === "" ||
        formattedData[key] === undefined ||
        (Array.isArray(formattedData[key]) && formattedData[key].length === 0)
      ) {
        formattedData[key] = null;
      }
    });

    try {
      await axios.put(
        `https://crm.bees.in/api/v1/customer/${id}`,
        formattedData
      );
      toast.success("Customer updated successfully!", {
        style: {
          backgroundColor: "#92a143",
          color: "#ffffff",
        },
      });
      navigate("/Admin/Customer");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update customer."
      );
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
        Edit Customer
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Name Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Phone Input Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="phone"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Phone
          </label>
          <PhoneInput
            id="phone"
            country={"in"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
            }}
          />
        </div>

        {/* Date of Birth Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="dob"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Date of Birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        {/* Active Status Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="Active"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Active
          </label>
          <select
            id="Active"
            name="Active"
            value={formData.Active}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Customer Code Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="customercode"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Customer Code
          </label>
          <input
            id="customercode"
            name="customercode"
            type="text"
            value={formData.customercode}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Tags Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="tags"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Tags
          </label>
          <Select
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleTagsChange}
            options={tagsOptions}
            isMulti
            placeholder="Select tags"
            styles={{
              control: base => ({
                ...base,
                borderColor: "#ccc",
                padding: "5px",
              }),
            }}
          />
        </div>

        {/* Groups Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="groups"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Groups
          </label>
          <Select
            id="groups"
            name="groups"
            value={formData.groups}
            onChange={handleGroupsChange}
            options={groupsOptions}
            placeholder="Select group"
            styles={{
              control: base => ({
                ...base,
                borderColor: "#ccc",
                padding: "5px",
              }),
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#e5337f",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminEditCustomer;
