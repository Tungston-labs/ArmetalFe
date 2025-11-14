import { Route, Routes } from "react-router-dom";
import "./index.css";
import LoginForm from "./Pages/login/Login";
import Layout from "./Components/Layout";
import DepartmentList from "./Pages/department/DepartmentList";
// import Dashboard from "./Pages/dashboard/Dashboard";
import DepartmentDetails from "./Pages/department/DepartmentDetails.jsx";

import EmployeeList from "./Pages/leaveDetails/EmployeeList.jsx";
import Holiday from "./Pages/holiday/Holiday.jsx";
import Payroll from "./Pages/payroll/Payroll.jsx";
import SuperAdmin from "./Pages/superAdmin/SuperAdmin.jsx";
import AddCompany from "./Pages/superAdmin/AddCompany.jsx";
import Visa from "./Pages/visa/Visa.jsx";
import DailyTask from "./Pages/dailytask/Daily.jsx";
import BasicLevel from "./Pages/employee/BasicLevel.jsx";
import BankPayment from "./Pages/employee/BankPayment.jsx";
import Documents from "./Pages/employee/Documents.jsx";
import LeaveRequest from "./Pages/leaveDetails/LeaveRequest.jsx";
import EmployeeLeaveDetails from "./Pages/leaveDetails/EmployeeLeaveDetails.jsx";
import Attendance from "./Pages/attendance/Attendance.jsx";
// import OnLeave from "./Pages/attendance/OnLeave.jsx";
import EmployeesOnLeave from "./Pages/onLeave/EmployeesOnLeave.jsx";

import ViewBasic from "./Pages/employee/ViewBasic.jsx"
import ViewBankpayment from "./Pages/employee/ViewBankpayment.jsx"
import ViewDocument from "./Pages/employee/ViewDocument.jsx"
import Payroll1 from "./Pages/payroll/Payroll1.jsx";
import RequireAuth from "./Components/RequireAuth.jsx";
import Viewpage from "./Pages/superAdmin/Viewpage.jsx";
import PayrollFinal from "./Pages/payroll/PayrollFinal.jsx";
import ForgetPassword from "./Pages/login/ForgetPassword.jsx";
import Verification from "./Pages/login/Verification.jsx";
import NewPassword from "./Pages/login/NewPassword.jsx";
import Loder from "./Components/Loder.jsx";
import LeftContent from "./Pages/employeDashboard/LeftContent.jsx";
import Employeedashboard from "./Pages/employeDashboard/Employeedashboard.jsx"
import FullDashboard from "./Pages/employeDashboard/FullDashboard.jsx";


import LeaveList from "./Pages/onLeave/LeaveList.jsx";


import DetailOnleave from "./Pages/onLeave/DetailOnleave.jsx"
import NewDashboard from "./Pages/dashboard/NewDashboard.jsx";
import DashboardNew from "./Pages/dashboard/DashboardNew.jsx";
import Reimbursement from "./Pages/reimbursement/Reimb_Department.jsx"
import Reimbpage from "./Pages/reimbursement/ReimbPage.jsx"
import Reimb_info from "./Pages/reimbursement/Reimb_info.jsx"
import FinancePage from "./Pages/finance/FinancePage.jsx"
import Dashboard from "./Pages/employeDashboard/LeftContent.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Redux/authSlice";
import Superadmin_Dashboard from "./Pages/superAdmin/Superadmin_Dashboard.jsx"
import FieldShift from "./Pages/Shift/FieldShift.jsx"
import FieldDepartment from "./Pages/Shift/FieldDepartment.jsx"
import FieldInfo from "./Pages/Shift/FieldInfo.jsx";
import JobDetails from "./Components/JobDetails.jsx";
import EmployeeHeader from "./Components/EmployeeHeader.jsx";


import AttendanceList from "./Pages/attendance/AttendanceList.jsx"
import EmployeeTitle from "./Components/EmployeeTitle.jsx"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (user && accessToken) {
      dispatch(login({
        userName: user.username,
        accessToken,
        user,
      }));
    }
  }, [dispatch]);

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
            <Route index element={<DashboardNew />} />
            <Route path="/department" element={<DepartmentList />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/employee" element={<EmployeeList />} />
            <Route path="superadmin/view/:id" element={<Viewpage />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/payrolldetails/:id" element={<Payroll />} />
            <Route path="/payrolldetails" element={<PayrollFinal />} />
            <Route path="/superadmin" element={<SuperAdmin />} />
            <Route path="/superadmin-dashboard" element={<Superadmin_Dashboard />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/employee-Contract-Visa-Expiry" element={<Visa />} />
            <Route path="/daily-task" element={<DailyTask />} />
            <Route path="/basic-details" element={<BasicLevel />} />
            <Route path="/bank-payment" element={<BankPayment />} />
            <Route path="/documents" element={<Documents />} />
            {/* <Route path="/edit-basic-level " element={<EditBasicLevel />} /> */}
            <Route path="/employee-leave-request" element={<LeaveRequest />} />
            <Route
              path="/leave-details/:id"
              element={<EmployeeLeaveDetails />}
            />
            <Route path="/attendance/detail/:id" element={<Attendance />} />
            <Route path="/leave" element={<LeaveList />} />
            <Route path="/ViewBasic/:id" element={<ViewBasic />} />
            <Route path="/employee-on-leave" element={<LeaveList />} />

            <Route path="/dashboard" element={<NewDashboard />} />

            <Route path="/employee-attendance" element={<AttendanceList />} />

            <Route path="/employee-leave" element={<DetailOnleave />} />


            <Route path="/ViewBasic/:id/bank" element={<ViewBankpayment />} />
            <Route path="/ViewBasic/:id/documents" element={<ViewDocument />} />
            <Route path="/employee-dashboard" element={<Employeedashboard />} />
            <Route path="/leftcontent" element={<LeftContent />} />
            <Route path="/fulldashboard/:employeeId" element={<FullDashboard />} />

            <Route path="/reimbursement" element={<Reimbursement />} />
            <Route path="/reimbursement_detail/:id" element={<Reimbpage />} />
            <Route path="/reimbursement_info/:id" element={<Reimb_info />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/project" element={<FieldShift />} />
            <Route path="/project-department/:id/" element={<FieldDepartment />} />
<Route path="/project/:id" element={<FieldInfo />} />
            <Route path="/card" element={<Dashboard />}/>
            
<Route path="/job" element={<JobDetails />}></Route>
<Route path="/header" element={<EmployeeHeader />}></Route>
          
            <Route path="/title" element={<EmployeeTitle/>}></Route>
 
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
