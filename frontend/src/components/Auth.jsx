import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setEmail } from "../features/auth/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoOf from "../../logoOf.png";
import axios from "axios";
const Auth = () => {
  const [email, setEmailLocal] = useState("");
  const [customerCode, setCustomerCodeLocal] = useState("");
  const [password, setPassword] = useState("");
  const [identity, setIdentity] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomerCode, setShowCustomerCode] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
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
          if (data.user.password) {
            setShowPassword(true);
          } else {
            const otpResponse = await fetch(
              "https://crm.bees.in/api/v1/otp/send-otp",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, login: true }),
              }
            );

            if (otpResponse.ok) {
              navigate("/EnterOtp");
            } else {
              const otpErrorData = await otpResponse.text();
              toast.error(
                otpErrorData || "Failed to send OTP. Please try again."
              );
            }
          }
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
    console.log(customerCode);
  
    try {
      // First request to check if the customer code exists
      const checkCustomerCodeResponse = await fetch(
        `https://crm.bees.in/api/v1/customer/check-customercode/${customerCode}`
      );
  
      // Handle case where customer code exists (status 409 indicates conflict, meaning code exists)
      if (checkCustomerCodeResponse.status === 409) {
        // Fetch customer details using axios
        const { data } = await axios.get(
          `https://crm.bees.in/api/v1/customer/code/${customerCode}`
        );
  
        console.log(data); // Log customer data
  
        // Check if the fetched data contains a password
        if (data.password) {
          setShowPassword(true);
          setShowCustomerCode(false);
        } else {
          // Send OTP request
          const otpResponse = await fetch("https://crm.bees.in/api/v1/otp/send-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }), // Assuming `email` is available in your component scope
          });
  
          // Handle OTP respons
          console.log(otpResponse)
          if (otpResponse) {
            navigate("/EnterOtpCustomer"); // Navigate to OTP entry page
          } else {
            // Show error message if OTP sending fails
            toast.error(
              "OTP already sent. Please wait. The next OTP can only be generated after 10 minutes."
            );
          }
        }
      } else {
        // Show error if customer code does not exist
        toast.error("Customer code does not exist. Please register first.");
      }
    } catch (error) {
      // General error handling
      toast.error(error.message || "An unexpected error occurred");
      console.error("Error in handleCustomerCodeSubmit:", error);
    }
  };
  const handleLogin = async () => {
    try {
      const loginPayload = {
        email,
        password,
        ...(identity === 2 && { customerCode }),
      };

      const response = await fetch("https://crm.bees.in/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        toast.error("Invalid email or password");
        return;
      }

      const data = await parseJSON(response);
      if (!data) {
        toast.error("Invalid response from server");
        return;
      }

      const userData = {
        user: {
          userId: data.userId,
          email: data.email,
        },
        role: data.role,
        token: data.token,
        email,
        customerCode: identity === 2 ? customerCode : null,
      };

      dispatch(login(userData));
      toast.success("Login successful", {
        style: {
          backgroundColor: "#92a143", // Your custom color
          color: "#ffffff", // Text color, if needed
        },
      });

      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "employee") {
        navigate("/employee");
      } else if (data.role === "customer") {
        navigate("/customer");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleForgotPassword = () => {
    navigate("/ForgotPassword");
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      if (!showCustomerCode && !showPassword) {
        handleEmailSubmit();
      } else if (showCustomerCode && !showPassword) {
        handleCustomerCodeSubmit();
      } else if (showPassword) {
        handleLogin();
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
          Login
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmailLocal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mb-4 p-3 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        {!showPassword && !showCustomerCode && (
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
        {showPassword && (
          <>
            <div className="relative mb-4 w-full max-w-xs">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              onClick={handleLogin}
              className="mb-4 p-3 bg-indigo-600 text-white rounded w-full max-w-xs hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </>
        )}
        <button
          onClick={handleForgotPassword}
          className="text-sm text-indigo-500 hover:underline focus:outline-none"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Auth;
