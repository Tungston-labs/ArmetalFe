import { Route, Routes } from "react-router-dom";
import "./index.css";
import LoginForm from "./Pages/login/Login";
import Layout from "./Components/Layout";
import Department from "./Pages/department/Department";
import Dashboard from "./Pages/dashboard/Dashboard";
import DepartmentDetails from "./Pages/department/DepartmentDetails.jsx";
import Table from "./Components/Table.jsx";
import EmployeeList from "./Pages/employee/EmployeeList.jsx";
import Holiday from "./Pages/holiday/Holiday.jsx";
import Payroll from "./Pages/payroll/Payroll.jsx"
import SuperAdmin from "./Pages/superAdmin/SuperAdmin.jsx"
import AddCompany from "./Pages/superAdmin/AddCompany.jsx"
import EditCompany from "./Pages/superAdmin/EditCompany.jsx";
import Visa from "./Pages/employee/Visa.jsx"
import DailyTask from "./Pages/dailytask/Daily.jsx";
import BasicLevel from "./Pages/employee/BasicLevel.jsx";
import BankPayment from "./Pages/employee/BankPayment.jsx"
import Documents from "./Pages/employee/Documents.jsx"
import EditBasicLevel from "./Pages/employee/EditBasiclevel.jsx"
import LeaveRequest from "./Pages/employee/LeaveRequest.jsx";
import EmployeeLeaveDetails from "./Pages/employee/EmployeeLeaveDetails.jsx";
import Attendance from "./Pages/employee/Attendance.jsx";
import OnLeave from "./Pages/employee/OnLeave.jsx";

function App() {
  return (
    <>

      <Routes>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/department" element={<Department />} />
        
          <Route path="/employee" element={<EmployeeList />} />
          <Route path="/department-details" element={<DepartmentDetails />} />
          <Route path="/table" element={<Table />} />
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/edit-company" element={<EditCompany />} />
          <Route path="/employee-visa" element={<Visa />} />
          <Route path="/daily-task" element={<DailyTask />} />
          <Route path="/basic-details" element={<BasicLevel />} />
          <Route path="/bank-payment" element={<BankPayment />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/edit-basic-level " element={<EditBasicLevel />} />
          <Route path="/leave-request" element={<LeaveRequest/>}/>
          <Route path="/leave-details" element={<EmployeeLeaveDetails/>}/>
            <Route path="/employee-attendance" element={<Attendance/>}/>
               <Route path="/on-leave" element={<OnLeave/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;