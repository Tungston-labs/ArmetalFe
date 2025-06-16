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
import Visa from "./Pages/visa/Visa.jsx"
import DailyTask from "./Pages/dailytask/Daily.jsx";
import BasicLevel from "./Pages/employee/BasicLevel.jsx";
import BankPayment from "./Pages/employee/BankPayment.jsx"
import Documents from "./Pages/employee/Documents.jsx"
// import EditBasicLevel from "./Pages/employee/EditBasiclevel.jsx"
import LeaveRequest from "./Pages/leaveDetails/LeaveRequest.jsx";
import EmployeeLeaveDetails from "./Pages/leaveDetails/EmployeeLeaveDetails.jsx";
import Attendance from "./Pages/leaveDetails/Attendance.jsx";
import OnLeave from "./Pages/leaveDetails/OnLeave.jsx";
import ViewBasic from "./Pages/employee/ViewBasic.jsx"
import ViewBankpayment from "./Pages/employee/ViewBankpayment.jsx"
import ViewDocument from "./Pages/employee/ViewDocument.jsx"
import BasicFormEdit from "./Pages/editform/BasicFormEdit.jsx"
import BankpaymentEdit from "./Pages/editform/BankpaymentEdit.jsx"
import DocumentEdit from "./Pages/editform/DocumentEdit.jsx"
import Succes  from "./Components/Succes.jsx";
import ConfirmLeaveModal from "./Components/ConfirmLeaveModal.jsx";
import EditDepartment from "./Pages/department/EditDepartment.jsx"
import Payroll1 from "./Pages/payroll/Payroll1.jsx"
function App() {
  return (
    <>

      <Routes>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/department" element={<Department />} />
             <Route path="/department-details" element={<DepartmentDetails />} />
                  <Route path="/edit-department" element={<EditDepartment />} />
          <Route path="/employee" element={<EmployeeList />} />
     
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
          {/* <Route path="/edit-basic-level " element={<EditBasicLevel />} /> */}
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/leave-details" element={<EmployeeLeaveDetails />} />
          <Route path="/employee-attendance" element={<Attendance />} />
          <Route path="/on-leave" element={<OnLeave />} />
          <Route path="/view-basic" element={<ViewBasic />} />
          <Route path="/view-bankpayment" element={<ViewBankpayment />} />
          <Route path="/view-documents" element={<ViewDocument />} />
          <Route path="/edit-basicform" element={<BasicFormEdit />} />
             <Route path="/edit-bankpayment" element={<BankpaymentEdit/>} />
               <Route path="/edit-document" element={<DocumentEdit/>} />
               <Route path="/succes" element={<Succes/>}/>
                <Route path="/confirm" element={<ConfirmLeaveModal/>}/>
  <Route path="/payrolls" element={<Payroll1/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;