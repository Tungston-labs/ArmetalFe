import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Panel,
  CloseIcon,
  Columns,
  BottomActions,
  ActionButton,
  LogoutButton
} from "./RightModal.Styles";
import AttendanceCircle from "./AttendanceCircle";
import SingleHolidayCalendar from "./SingleHolidayCalendar.jsx";
import Notifications from "./Notifications";
import API from "../../services/api";
import Swal from "sweetalert2";
import { useLogout } from "../../services/logout";
import {
  getHolidaySummary,
  getTodayEmployeeStats,
  getSimpleNotifications,
} from "../../Redux/dashboardSlice";

const RightModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const logout = useLogout();

  const { notifications, todayStats, holidaySummary, loading } = useSelector(
    (state) => state.dashboard
  );

  // Load APIs only when modal opens
  useEffect(() => {
    if (open) {
      dispatch(getSimpleNotifications());
      dispatch(getTodayEmployeeStats());
      dispatch(getHolidaySummary());
    }
  }, [open, dispatch]);

  // --------------------------
  // Logout Handler using useLogout
  // --------------------------
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await logout(); // use your custom logout hook
      onClose();
    }
  };

  // --------------------------
  // Change Password Handler
  // --------------------------
  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html: `
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Old Password">
        <input type="password" id="newPassword" class="swal2-input" placeholder="New Password">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          old_password: document.getElementById("oldPassword").value,
          new_password: document.getElementById("newPassword").value,
        };
      },
    });

    if (formValues) {
      try {
        await API.post("http://178.248.112.16:8001/api/change-password/", formValues);
        Swal.fire("Success", "Password changed successfully", "success");
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.detail || "Failed to change password",
          "error"
        );
      }
    }
  };

  return (
    <Panel className={open ? "open" : ""}>
      <CloseIcon onClick={onClose}>×</CloseIcon>

      {/* Notifications */}
      <Columns>
        {loading.notifications ? (
          <p>Loading notifications...</p>
        ) : (
          <Notifications items={notifications?.notifications || []} />
        )}
      </Columns>

      {/* Attendance */}
      <Columns>
        {loading.todayStats ? (
          <p>Loading attendance...</p>
        ) : todayStats ? (
          <AttendanceCircle
            present={todayStats?.present_percentage}
            leave={todayStats?.leave_percentage}
          />
        ) : (
          <p>No stats found</p>
        )}
      </Columns>

      {/* Holiday Calendar */}
      <Columns>
        {loading.holidaySummary ? (
          <p>Loading holidays...</p>
        ) : holidaySummary ? (
          <SingleHolidayCalendar
            holidays={holidaySummary?.upcoming_holidays || []}
          />
        ) : (
          <p>No holidays found</p>
        )}
      </Columns>

      {/* Bottom Actions: Change Password & Logout */}
      <BottomActions>
        <ActionButton onClick={handleChangePassword}>
          Change Password
        </ActionButton>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </BottomActions>
    </Panel>
  );
};

export default RightModal;
