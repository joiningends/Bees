import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the library's CSS

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    active: "yes",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneChange = value => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post("https://crm.bees.in/api/v1/employee", formData);
      toast.success("Employee created successfully!", {
        style: {
          backgroundColor: "#92a143",
          color: "#ffffff",
        },
      });
      setTimeout(() => {
        navigate("/Admin/Employee");
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
        Create Employee
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
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="phone"
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Phone *
          </label>
          <PhoneInput
            country={"in"} // Set default country as India
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e5337f",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              outline: "none",
              paddingLeft: "48px", // Ensures the input text doesn't hide behind the flag
            }}
            containerStyle={{ width: "100%" }}
            buttonStyle={{ border: "1px solid #e5337f" }} // Ensures the flag button matches the input style
            searchStyle={{
              backgroundColor: "#f5f8ff", // Matches the form's background
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#e5337f" }}
          >
            Active
          </label>
          <div>
            <label style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="active"
                value="yes"
                checked={formData.active === "yes"}
                onChange={handleChange}
                style={{ marginRight: "5px" }}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="active"
                value="no"
                checked={formData.active === "no"}
                onChange={handleChange}
                style={{ marginRight: "5px" }}
              />
              No
            </label>
          </div>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#e5337f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          Create Employee
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEmployee;
