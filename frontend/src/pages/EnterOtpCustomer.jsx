import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoOf from "../../logoOf.png";

function EnterOtpCustomer() {
  const [otp, setOtp] = useState("");
  const email = useSelector(state => state.auth.email);
  const navigate = useNavigate();

  const handleOtpSubmit = async () => {
    try {
      const response = await fetch(
        "https://crm.bees.in/api/v1/otp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP submitted successfully", {
          style: {
            backgroundColor: "#92a143", // Your custom color
            color: "#ffffff", // Text color, if needed
          },
        });
        navigate(`/SetPasswordCustomer`);
      } else {
        toast.error(data.message || "Failed to verify OTP");
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP");
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action
      handleOtpSubmit(); // Call the submit function
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
          Enter OTP
        </h1>
        <p className="mb-4 text-gray-600">
          Your OTP will be sent to your email.
        </p>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          onKeyDown={handleKeyDown} // Add onKeyDown event
          className="mb-4 p-3 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <button
          onClick={handleOtpSubmit}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full max-w-xs transition duration-300"
          style={{ backgroundColor: "#4b57ad" }}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default EnterOtpCustomer;
