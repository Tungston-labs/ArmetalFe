import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/userSlice';
import authReducer from '../Redux/authSlice';
import departmentReducer from "../Redux/departmentSlice";
import holidayReducer from "../Redux/holidaySlice"


export const store = configureStore({
  reducer: {
    
    user: userReducer,
    auth:authReducer,
    departments: departmentReducer,
    holidays: holidayReducer,
  },
});
