// src/components/AdminRoutes.jsx
import { Route, Routes } from "react-router-dom";
import AdminDashBoard from "./AdminDashBoard";
import CreateEmployee from "../pages/CreateEmployee";
import CreateCustomer from "../pages/CreateCustomer";
import AdminCustomer from "../pages/AdminCustomer";
import AdminEditCustomer from "../pages/AdminEditCustomer";
import AdminEmployee from "../pages/AdminEmployee";
import AdminEditEmployee from "../pages/AdminEditEmployee";
import Setting from "../pages/Setting";
import AdminTicketCreationPage from "../pages/AdminTicketCreationPage";
import ReportByCustomer from "../pages/ReportByCustomer";
import ReportByEmployee from "../pages/ReportByEmployee";
import ReportByTicketType from "../pages/ReportByTicketType";
import AllTickets from "../pages/AllTickets";
import BulkEmailSetting from "../pages/BulkEmailSetting";
import BirthDayMessage from "../pages/BirthDayMessage";
import Notification from "../pages/Notification";
import DeleteReport from "../pages/DeleteReport";
import AdminTags from "../pages/AdminTags";
import AdminGroups from "../pages/AdminGroups";
import BirthDayReport from "../pages/BirthDayReport";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/Ticket" element={<AdminTicketCreationPage />} />
      <Route path="/Ticket/ViewEditTickets" element={<AllTickets />} />
      {/* <Route path="/Ticket/OpenTicket" element={<AdminOpenTicket />} /> */}
      {/* <Route path="/Ticket/ClosedTicket" element={<AdminClosedTicket />} /> */}
      <Route path="/" element={<AdminDashBoard />} />
      <Route path="/Employee/createEmployee" element={<CreateEmployee />} />
      <Route path="/Employee" element={<AdminEmployee />} />
      <Route
        path="/Employee/EmployeeEdit/:id"
        element={<AdminEditEmployee />}
      />
      <Route path="/Customer/CreateCustomer" element={<CreateCustomer />} />
      <Route path="/Customer" element={<AdminCustomer />} />
      <Route
        path="/Customer/CustomerEdit/:id"
        element={<AdminEditCustomer />}
      />
      <Route path="/Settings" element={<Setting />} />
      <Route path="/CustomerReport" element={<ReportByCustomer />} />
      <Route path="/EmployeeReport" element={<ReportByEmployee />} />
      <Route path="/TicketTypeReport" element={<ReportByTicketType />} />
      <Route path="/BirthdayReport" element={<BirthDayReport />} />
      <Route path="/BulkEmail" element={<BulkEmailSetting />} />
      <Route path="/BirthdayMesage" element={<BirthDayMessage />} />
      <Route path="/Notifications" element={<Notification />} />
      <Route path="/DeleteReport" element={<DeleteReport />} />
      <Route path="/Tags" element={<AdminTags />} />
      <Route path="/Groups" element={<AdminGroups/>} />
    </Routes>
  );
};

export default AdminRoutes;
