import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import icons from Heroicons
import logoOf from "../../logoOf.png";

function SetPasswordEmployee() {
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  let customerCode = useSelector(state => state.auth.customerCode);
  const navigate = useNavigate();

  const handleSetPassword = async () => {
    if (password !== reenterPassword) {
      toast.error("Passwords do not match");
      return;
    }
    customerCode = localStorage.getItem("customerCode");

    try {
      const response = await fetch(
        "https://crm.bees.in/api/v1/customer/update/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customercode: customerCode,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password set successfully", {
          style: {
            backgroundColor: "#92a143", // Your custom color
            color: "#ffffff", // Text color, if needed
          },
        });
        navigate("/"); // Navigate to the root path
      } else {
        toast.error(data.message || "Failed to set password");
      }
    } catch (error) {
      toast.error("An error occurred while setting the password");
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleSetPassword();
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
          Set Password
        </h1>
        <div className="relative mb-4 w-full max-w-xs">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown} // Add this
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <div className="relative mb-4 w-full max-w-xs">
          <input
            type={showReenterPassword ? "text" : "password"}
            placeholder="Re-enter Password"
            value={reenterPassword}
            onChange={e => setReenterPassword(e.target.value)}
            onKeyDown={handleKeyDown} // Add this
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          />
          <button
            type="button"
            onClick={() => setShowReenterPassword(prev => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showReenterPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <button
          onClick={handleSetPassword}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full max-w-xs transition duration-300"
          style={{ backgroundColor: "#4b57ad" }}
        >
          Set Password
        </button>
      </div>
    </div>
  );
}

export default SetPasswordEmployee;
