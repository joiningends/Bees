import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setEmail } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoOf from "../../logoOf.png";

const ForgotPassword = () => {
  const [email, setEmailLocal] = useState("");
  const [customerCode, setCustomerCodeLocal] = useState("");
  const [identity, setIdentity] = useState(null);
  const [showCustomerCode, setShowCustomerCode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const parseJSON = async response => {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      const checkEmailResponse = await fetch(
        `https://crm.bees.in/api/v1/users/check-email/${email}`
      );

      if (checkEmailResponse.status === 409) {
        const response = await fetch(
          `https://crm.bees.in/api/v1/users/email/${email}`
        );
        if (!response.ok) {
          const errorData = await response.text();
          toast.error(errorData || "Email verification failed");
          return;
        }

        const data = await parseJSON(response);
        if (!data) {
          toast.error("Invalid response from server");
          return;
        }

        setIdentity(data.identify);
        dispatch(setEmail(email));

        if (data.identify === 2) {
          setShowCustomerCode(true);
        } else {
          // Navigate to Enter OTP page for all users
          navigate("/EnterOtp");
        }
      } else {
        toast.error("Email does not exist. Please register first.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCustomerCodeSubmit = async () => {
    if (!customerCode) {
      toast.error("Customer code is required");
      return;
    }

    localStorage.setItem("customerCode", customerCode);

    try {
      const checkCustomerCodeResponse = await fetch(
        `https://crm.bees.in/api/v1/customer/check-customercode/${customerCode}`
      );

      if (checkCustomerCodeResponse.status === 409) {
        const response = await fetch(
          `https://crm.bees.in/api/v1/users/email/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          toast.error(errorData || "Customer code verification failed");
          return;
        }

        const data = await parseJSON(response);
        if (!data) {
          toast.error("Invalid response from server");
          return;
        }

        // Navigate to Enter OTP page for customers
        navigate("/EnterOtpCustomer");
      } else {
        toast.error("Customer code does not exist. Please register first.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      if (!showCustomerCode) {
        handleEmailSubmit();
      } else if (showCustomerCode) {
        handleCustomerCodeSubmit();
      }
    }
  };

  return (
    <div
      className="flex h-screen font-sans bg-gray-100"
      style={{ backgroundColor: "#f8f8f8" }}
    >
      <ToastContainer />
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center animate-fade-in"
        style={{
          backgroundImage: `url(${logoOf})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          height: "30rem",
          margin: "Auto",
        }}
      ></div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-off-white shadow-lg">
        <h1
          className="text-4xl font-extrabold mb-6"
          style={{ color: "#484fa0" }}
        >
          Forgot Password
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmailLocal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-4 p-3 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        {!showCustomerCode && (
          <button
            onClick={handleEmailSubmit}
            className="mb-4 p-3 bg-indigo-600 text-white rounded w-full max-w-xs hover:bg-indigo-700 transition duration-300"
          >
            Submit
          </button>
        )}
        {showCustomerCode && (
          <>
            <input
              type="text"
              placeholder="Customer Code"
              value={customerCode}
              onChange={e => setCustomerCodeLocal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mb-4 p-3 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            <button
              onClick={handleCustomerCodeSubmit}
              className="mb-4 p-3 bg-indigo-600 text-white rounded w-full max-w-xs hover:bg-indigo-700 transition duration-300"
            >
              Submit Customer Code
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
