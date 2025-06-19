import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/userSlice';
import authReducer from '../Redux/authSlice';
import departmentReducer from "../Redux/departmentSlice";
import holidayReducer from "../Redux/holidaySlice"
import superAdminReducer from '../Redux/superAdminSlice'
import dailyTaskReducer from '../Redux/dailyTaskSlice'
import employeesReducer from '../Redux/employeeSlice'
import leaveReducer from '../Redux/leaveSlice'
import attendanceReducer from '../Redux/attendanceSlice'
import dashboardReducer from '../Redux/dashboardSlice'



export const store = configureStore({
  reducer: {
    
    user: userReducer,
    auth:authReducer,
    departments: departmentReducer,
    holidays: holidayReducer,
    superAdmin:superAdminReducer,
    dailyTask: dailyTaskReducer,
    employees: employeesReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    dashboard: dashboardReducer,

  },
});
