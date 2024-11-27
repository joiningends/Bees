import { Route, Routes } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import EmployeeTicketCreation from "../pages/EmployeeTicketCreation";
import EmployeeOpenTicket from "../pages/EmployeeOpenTicket";
import EmployeeClosedTicket from "../pages/EmployeeClosedTicket";
import BulkEmailSetting from "../pages/BulkEmailSetting";
import Notification from "../pages/Notification";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDashboard />} />
      <Route path="/Ticket" element={<EmployeeTicketCreation />} />
      <Route path="/Open" element={<EmployeeOpenTicket />} />
      <Route path="/Closed" element={<EmployeeClosedTicket />} />
      <Route path="/BulkEmail" element={<BulkEmailSetting />} />
      <Route path="/Notifications" element={<Notification />} />
    </Routes>
  );
};

export default EmployeeRoutes;
