import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Panel,
  CloseIcon,
  Columns,
  BottomActions,
  ActionButton,
  LogoutButton,
  TopActions,
  EditProfileButton,
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
import EditProfileModal from "../../Components/homepage/EditProfileModal.jsx";

const RightModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const logout = useLogout();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { notifications, todayStats, holidaySummary, loading } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (open) {
      dispatch(getSimpleNotifications());
      dispatch(getTodayEmployeeStats());
      dispatch(getHolidaySummary());
    }
  }, [open, dispatch]);

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
      await logout();
      onClose();
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      confirmButtonText: "Update Password",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
      focusConfirm: false,

      html: `
      <div style="
        display: flex;
        flex-direction: column;
        gap: 14px;
        text-align: left;
        margin-top: 10px;
      ">
        <div>
          <label style="font-size:1rem; font-weight:500;">Old Password:</label>
          <input 
            type="password" 
            id="oldPassword" 
            class="swal2-input"
            style="margin-top:6px"
            placeholder="Enter old password"
              autoComplete="off"
          />
        </div>

<div>
  <label style="font-size:1rem; font-weight:500;">New Password:</label>
  <input 
    type="password"
    id="newPassword"
    class="swal2-input"
    style="margin-top:6px"
    placeholder="Enter new password"
    autocomplete="new-password"
  />
</div>

      </div>
    `,

      preConfirm: () => {
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;

        if (!oldPassword || !newPassword) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }

        if (newPassword.length < 6) {
          Swal.showValidationMessage("Password must be at least 6 characters");
          return false;
        }

        return {
          old_password: oldPassword,
          new_password: newPassword,
        };
      },
    });

    if (!formValues) return;

    try {
      Swal.fire({
        title: "Updating password...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await API.post(
        "/change-password/",
        formValues,
      );

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully",
        confirmButtonColor: "#16a34a",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to change password",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <Panel className={open ? "open" : ""}>
      <CloseIcon onClick={onClose}>×</CloseIcon>
      <TopActions>
        <EditProfileButton
          onClick={() => {
            setIsEditMode(true);
            setSelectedCompany(null);
            setShowCompanyModal(true);
          }}
        >
          Edit Profile
        </EditProfileButton>

        <CloseIcon onClick={onClose}>×</CloseIcon>
      </TopActions>
      <Columns>
        {loading.notifications ? (
          <p>Loading notifications...</p>
        ) : (
          <Notifications items={notifications?.notifications || []} />
        )}
      </Columns>
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

      <BottomActions>
        <ActionButton onClick={handleChangePassword}>
          Change Password
        </ActionButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </BottomActions>

      {showCompanyModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "900px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <EditProfileModal
              isEdit={isEditMode}
              selectedCompany={selectedCompany}
                showPrivileges={false}
              onClose={() => setShowCompanyModal(false)}
            />
          </div>
        </div>
      )}
    </Panel>
  );
};

export default RightModal;
