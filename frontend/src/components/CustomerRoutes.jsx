import { Route, Routes } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";

import CustomerTicket from "../pages/CustomerTicket";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/Ticket" element={<CustomerTicket />} />
    </Routes>
  );
};

export default CustomerRoutes;
