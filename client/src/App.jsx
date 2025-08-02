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
import Payroll from "./Pages/payroll/Payroll.jsx";
import SuperAdmin from "./Pages/superAdmin/SuperAdmin.jsx";
import AddCompany from "./Pages/superAdmin/AddCompany.jsx";
import Visa from "./Pages/visa/Visa.jsx";
import DailyTask from "./Pages/dailytask/Daily.jsx";
import BasicLevel from "./Pages/employee/BasicLevel.jsx";
import BankPayment from "./Pages/employee/BankPayment.jsx";
import Documents from "./Pages/employee/Documents.jsx";
// import EditBasicLevel from "./Pages/employee/EditBasiclevel.jsx"
import LeaveRequest from "./Pages/leaveDetails/LeaveRequest.jsx";
import EmployeeLeaveDetails from "./Pages/leaveDetails/EmployeeLeaveDetails.jsx";
import Attendance from "./Pages/leaveDetails/Attendance.jsx";
import OnLeave from "./Pages/leaveDetails/OnLeave.jsx";
import ViewBasic from "./Pages/employee/ViewBasic.jsx";
import ViewBankpayment from "./Pages/employee/ViewBankpayment.jsx";
import ViewDocument from "./Pages/employee/ViewDocument.jsx";
import BasicFormEdit from "./Pages/editform/BasicFormEdit.jsx";
import BankpaymentEdit from "./Pages/editform/BankpaymentEdit.jsx";
import DocumentEdit from "./Pages/editform/DocumentEdit.jsx";
import Succes from "./Components/Succes.jsx";
import ConfirmLeaveModal from "./Components/ConfirmLeaveModal.jsx";
import Payroll1 from "./Pages/payroll/Payroll1.jsx";
import RequireAuth from "./Components/RequireAuth.jsx";
import Viewpage from "./Pages/superAdmin/Viewpage.jsx";
import PayrollFinal from "./Pages/payroll/PayrollFinal.jsx";
import ForgetPassword from "./Pages/login/ForgetPassword.jsx";
import Verification from "./Pages/login/Verification.jsx";
import NewPassword from "./Pages/login/NewPassword.jsx";
import Loder from "./Components/Loder.jsx";
import Sample from"./Pages/employeDashboard/Sample.jsx";
import Employeedashboard from "./Pages/employeDashboard/Employeedashboard.jsx"
import FullDashboard from "./Pages/employeDashboard/FullDashboard.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/loader" element={<Loder />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/payrolls" element={<Payroll1 />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/department" element={<Department />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/employee" element={<EmployeeList />} />
            <Route path="/view/:id" element={<Viewpage />} />
            <Route path="/table" element={<Table />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/payroll/:id" element={<Payroll />} />
            <Route path="/payrolldetails" element={<PayrollFinal />} />
            <Route path="/superadmin" element={<SuperAdmin />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/employee-visa" element={<Visa />} />
            <Route path="/daily-task" element={<DailyTask />} />
            <Route path="/basic-details" element={<BasicLevel />} />
            <Route path="/bank-payment" element={<BankPayment />} />
            <Route path="/documents" element={<Documents />} />
            {/* <Route path="/edit-basic-level " element={<EditBasicLevel />} /> */}
            <Route path="/leave-request" element={<LeaveRequest />} />
            <Route
              path="/leave-details/:id"
              element={<EmployeeLeaveDetails />}
            />
            <Route path="/attendance/detail/:id" element={<Attendance />} />
            <Route path="/on-leave" element={<OnLeave />} />
            <Route path="/ViewBasic/:id" element={<ViewBasic />} />
            <Route path="/ViewBasic/:id/bank" element={<ViewBankpayment />} />
            <Route path="/ViewBasic/:id/documents" element={<ViewDocument />} />
            <Route path="/edit-basicform" element={<BasicFormEdit />} />
            <Route path="/edit-bankpayment" element={<BankpaymentEdit />} />
            <Route path="/edit-document" element={<DocumentEdit />} />
            <Route path="/succes" element={<Succes />} />
            <Route path="/confirm" element={<ConfirmLeaveModal />} />
              <Route path="/employee-dashboard" element={<Employeedashboard />} />
              <Route path="/sample" element={<Sample />} />
              <Route path="/fulldashboard" element={<FullDashboard/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
